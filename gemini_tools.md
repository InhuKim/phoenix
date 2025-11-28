# Google AI Studio Tool 기능 추가 가이드

## 개요

현재 Phoenix 프로젝트에서 OpenAI와 Anthropic은 Tool 기능을 완전히 지원하지만, Google AI Studio는 메시지만 지원합니다. 이 문서는 Google AI Studio에 Tool(Function Calling) 기능을 추가하는 방법을 상세히 설명합니다.

## 목차

1. [현재 상태 분석](#1-현재-상태-분석)
2. [Google Gemini API Tool 지원 확인](#2-google-gemini-api-tool-지원-확인)
3. [구현 방법](#3-구현-방법)
4. [테스트 방법](#4-테스트-방법)
5. [참고 자료](#5-참고-자료)

---

## 1. 현재 상태 분석

### 1.1 OpenAI 구현

**파일 위치:** `src/phoenix/server/api/helpers/playground_clients.py:337-464`

**지원 기능:**
- `tool_choice` invocation parameter 지원
- `response_format` invocation parameter 지원
- Tool calls을 메시지에 포함 가능
- Tool result 메시지 지원

**핵심 코드:**

```python
# Tool choice와 response format 파라미터 (Line 322-330)
JSONInvocationParameter(
    invocation_name="tool_choice",
    label="Tool Choice",
    canonical_name=CanonicalParameterName.TOOL_CHOICE,
),
JSONInvocationParameter(
    invocation_name="response_format",
    label="Response Format",
    canonical_name=CanonicalParameterName.RESPONSE_FORMAT,
),

# API 호출시 tools 전달 (Line 362)
async for chunk in await throttled_create(
    messages=openai_messages,
    model=self.model_name,
    tools=tools or NOT_GIVEN,
    **invocation_parameters,
):

# Tool call 응답 처리 (Line 376-392)
if (tool_calls := delta.tool_calls) is not None:
    for tool_call_index, tool_call in enumerate(tool_calls):
        tool_call_chunk = ToolCallChunk(
            id=tool_call_id,
            function=FunctionCallChunk(
                name=function.name or "",
                arguments=function.arguments or "",
            ),
        )
        yield tool_call_chunk
```

### 1.2 Anthropic 구현

**파일 위치:** `src/phoenix/server/api/helpers/playground_clients.py:1552-1682`

**지원 기능:**
- `tool_choice` invocation parameter 지원
- Tool calls을 메시지 content에 포함
- Tool result 메시지 지원 (role: "user"로 변환)

**핵심 코드:**

```python
# Tool choice 파라미터 (Line 1545-1550)
JSONInvocationParameter(
    invocation_name="tool_choice",
    label="Tool Choice",
    canonical_name=CanonicalParameterName.TOOL_CHOICE,
),

# API 호출시 tools 전달 (Line 1564-1570)
anthropic_params = {
    "messages": anthropic_messages,
    "model": self.model_name,
    "system": system_prompt,
    "tools": tools,
    **invocation_parameters,
}

# Tool call 응답 처리 (Line 1603-1614)
elif (
    isinstance(event, anthropic_streaming.ContentBlockStopEvent)
    and event.content_block.type == "tool_use"
):
    tool_call_chunk = ToolCallChunk(
        id=event.content_block.id,
        function=FunctionCallChunk(
            name=event.content_block.name,
            arguments=json.dumps(event.content_block.input),
        ),
    )
    yield tool_call_chunk
```

### 1.3 Google AI Studio 현재 구현

**파일 위치:** `src/phoenix/server/api/helpers/playground_clients.py:1803-1855`

**현재 지원:**
- 기본 메시지만 지원
- System instruction 지원
- 온도, max tokens 등 기본 파라미터만 지원

**누락된 기능:**
- ❌ Tool/Function calling 없음
- ❌ Response format 없음
- ❌ Tool choice 없음
- ❌ Tool result 메시지 처리 없음 (Line 1850-1851: `raise NotImplementedError`)

---

## 2. Google Gemini API Tool 지원 확인

Google Gemini API는 **완전한 Function Calling 기능을 제공**합니다.

### 2.1 주요 기능

- Function declarations 정의
- Tool config를 API 호출에 전달
- Function call 응답 수신
- Function result를 다시 모델에 전달
- Function calling modes: AUTO, ANY, NONE

### 2.2 Function Calling Modes

| Mode | 설명 | 사용 시기 |
|------|------|-----------|
| AUTO | 모델이 자연어 응답 또는 함수 호출을 결정 | 대부분의 시나리오 (기본값) |
| ANY | 항상 함수 호출을 예측하도록 강제 | 모든 프롬프트에 함수 호출이 필요한 경우 |
| NONE | 함수 호출 금지 | 함수 호출 없이 텍스트 응답만 필요한 경우 |

### 2.3 Python API 사용 예시

```python
from google import genai
from google.genai import types

# 1. Function declaration 정의
function_declaration = {
    "name": "schedule_meeting",
    "description": "Schedules a meeting with specified attendees",
    "parameters": {
        "type": "object",
        "properties": {
            "attendees": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of people attending"
            },
            "date": {
                "type": "string",
                "description": "Date of the meeting (e.g., '2024-07-29')"
            },
            "time": {
                "type": "string",
                "description": "Time of the meeting (e.g., '15:00')"
            },
        },
        "required": ["attendees", "date", "time"],
    },
}

# 2. Tool 생성 및 config 설정
tools = types.Tool(function_declarations=[function_declaration])
config = types.GenerateContentConfig(
    tools=[tools],
    tool_config=types.ToolConfig(
        function_calling_config=types.FunctionCallingConfig(
            mode=types.FunctionCallingMode.AUTO
        )
    )
)

# 3. API 호출
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Schedule a meeting with Bob for tomorrow at 10 AM",
    config=config,
)

# 4. Function call 확인 및 처리
if response.candidates[0].content.parts[0].function_call:
    function_call = response.candidates[0].content.parts[0].function_call
    print(f"Function to call: {function_call.name}")
    print(f"Arguments: {function_call.args}")

    # 실제 함수 실행
    result = execute_function(function_call.name, function_call.args)

    # 5. Function result를 모델에 전달
    function_response = types.Part.from_function_response(
        name=function_call.name,
        response={"result": result},
    )

    final_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[...previous_messages, function_response],
        config=config,
    )
    print(final_response.text)
```

---

## 3. 구현 방법

### 3.1 Backend 구현

#### Step 1: Tool choice와 response format invocation parameters 추가

**파일:** `src/phoenix/server/api/helpers/playground_clients.py`

**위치:** GoogleStreamingClient.supported_invocation_parameters 메서드 (Line 1759 이후)

```python
@classmethod
def supported_invocation_parameters(cls) -> list[InvocationParameter]:
    return [
        BoundedFloatInvocationParameter(
            invocation_name="temperature",
            canonical_name=CanonicalParameterName.TEMPERATURE,
            label="Temperature",
            default_value=1.0,
            min_value=0.0,
            max_value=2.0,
        ),
        IntInvocationParameter(
            invocation_name="max_output_tokens",
            canonical_name=CanonicalParameterName.MAX_COMPLETION_TOKENS,
            label="Max Output Tokens",
        ),
        StringListInvocationParameter(
            invocation_name="stop_sequences",
            canonical_name=CanonicalParameterName.STOP_SEQUENCES,
            label="Stop Sequences",
        ),
        FloatInvocationParameter(
            invocation_name="presence_penalty",
            label="Presence Penalty",
            default_value=0.0,
        ),
        FloatInvocationParameter(
            invocation_name="frequency_penalty",
            label="Frequency Penalty",
            default_value=0.0,
        ),
        BoundedFloatInvocationParameter(
            invocation_name="top_p",
            canonical_name=CanonicalParameterName.TOP_P,
            label="Top P",
            default_value=1.0,
            min_value=0.0,
            max_value=1.0,
        ),
        IntInvocationParameter(
            invocation_name="top_k",
            label="Top K",
        ),
        # 새로 추가할 파라미터들
        JSONInvocationParameter(
            invocation_name="tool_choice",
            label="Tool Choice",
            canonical_name=CanonicalParameterName.TOOL_CHOICE,
        ),
        JSONInvocationParameter(
            invocation_name="response_format",
            label="Response Format",
            canonical_name=CanonicalParameterName.RESPONSE_FORMAT,
        ),
    ]
```

#### Step 2: Helper 메서드 추가

**파일:** `src/phoenix/server/api/helpers/playground_clients.py`

**위치:** GoogleStreamingClient 클래스 내부에 추가

```python
def _convert_tools_to_google_format(
    self, tools: list[JSONScalarType]
) -> list[dict[str, Any]]:
    """
    Convert Phoenix tool format to Google function declarations.

    Phoenix format:
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather info",
            "parameters": {...}
        }
    }

    Google format:
    {
        "name": "get_weather",
        "description": "Get weather info",
        "parameters": {...}
    }
    """
    function_declarations = []
    for tool in tools:
        if isinstance(tool, dict) and "function" in tool:
            func = tool["function"]
            function_declarations.append({
                "name": func.get("name", ""),
                "description": func.get("description", ""),
                "parameters": func.get("parameters", {}),
            })
    return function_declarations

def _convert_tool_choice_to_google_mode(
    self, tool_choice: JSONScalarType
) -> str:
    """
    Convert Phoenix tool_choice to Google function calling mode.

    Phoenix tool_choice formats:
    - "auto" | "required" | "any" | "none"
    - {"type": "auto"} | {"type": "required"} | {"type": "any"} | {"type": "none"}
    - {"type": "function", "function": {"name": "specific_function"}}

    Google modes:
    - AUTO: Model decides
    - ANY: Always call a function
    - NONE: Never call functions

    Note: Google doesn't support forcing a specific function,
    so we map specific function choices to ANY mode.
    """
    from google.genai.types import FunctionCallingMode

    if isinstance(tool_choice, str):
        if tool_choice == "auto":
            return FunctionCallingMode.AUTO
        elif tool_choice in ["required", "any"]:
            return FunctionCallingMode.ANY
        elif tool_choice == "none":
            return FunctionCallingMode.NONE
    elif isinstance(tool_choice, dict):
        choice_type = tool_choice.get("type", "auto")
        if choice_type == "auto":
            return FunctionCallingMode.AUTO
        elif choice_type in ["required", "any", "function"]:
            # Google doesn't support specific function selection,
            # so we use ANY mode for all forced function calls
            return FunctionCallingMode.ANY
        elif choice_type == "none":
            return FunctionCallingMode.NONE

    return FunctionCallingMode.AUTO  # Default fallback
```

#### Step 3: chat_completion_create 메서드 업데이트

**파일:** `src/phoenix/server/api/helpers/playground_clients.py`

**위치:** GoogleStreamingClient.chat_completion_create 메서드 (Line 1803-1835 전체 교체)

```python
async def chat_completion_create(
    self,
    messages: list[
        tuple[ChatCompletionMessageRole, str, Optional[str], Optional[list[JSONScalarType]]]
    ],
    tools: list[JSONScalarType],
    **invocation_parameters: Any,
) -> AsyncIterator[ChatCompletionChunk]:
    from google.genai import types

    # Build contents and system prompt
    contents, system_prompt = self._build_google_messages(messages)

    # Build config object
    config_dict = invocation_parameters.copy()
    if system_prompt:
        config_dict["system_instruction"] = system_prompt

    # Convert and add tools if provided
    if tools:
        function_declarations = self._convert_tools_to_google_format(tools)
        google_tools = types.Tool(function_declarations=function_declarations)
        config_dict["tools"] = [google_tools]

        # Handle tool_choice if provided
        if "tool_choice" in config_dict:
            tool_choice = config_dict.pop("tool_choice")
            mode = self._convert_tool_choice_to_google_mode(tool_choice)
            config_dict["tool_config"] = types.ToolConfig(
                function_calling_config=types.FunctionCallingConfig(mode=mode)
            )

    # Handle response_format if provided
    if "response_format" in config_dict:
        response_format = config_dict.pop("response_format")
        # Google uses response_schema for structured output
        if isinstance(response_format, dict) and "json_schema" in response_format:
            config_dict["response_schema"] = response_format["json_schema"]["schema"]

    # Use the client's async models.generate_content_stream method
    stream = await self.client.aio.models.generate_content_stream(
        model=f"models/{self.model_name}",
        contents=contents,
        config=config_dict if config_dict else None,
    )

    async for event in stream:
        # Update token counts
        self._attributes.update({
            LLM_TOKEN_COUNT_PROMPT: event.usage_metadata.prompt_token_count,
            LLM_TOKEN_COUNT_COMPLETION: event.usage_metadata.candidates_token_count,
            LLM_TOKEN_COUNT_TOTAL: event.usage_metadata.total_token_count,
        })

        # Handle text content
        if event.text:
            yield TextChunk(content=event.text)

        # Handle function calls
        if event.candidates and len(event.candidates) > 0:
            candidate = event.candidates[0]
            if candidate.content and candidate.content.parts:
                for part in candidate.content.parts:
                    if hasattr(part, 'function_call') and part.function_call:
                        # Generate a unique ID for this tool call
                        # Google API doesn't provide IDs, so we create one
                        tool_call_id = f"call_{abs(hash(part.function_call.name))}"

                        tool_call_chunk = ToolCallChunk(
                            id=tool_call_id,
                            function=FunctionCallChunk(
                                name=part.function_call.name,
                                arguments=json.dumps(dict(part.function_call.args)),
                            ),
                        )
                        yield tool_call_chunk
```

#### Step 4: _build_google_messages 메서드 업데이트

**파일:** `src/phoenix/server/api/helpers/playground_clients.py`

**위치:** GoogleStreamingClient._build_google_messages 메서드 (Line 1836-1855 전체 교체)

```python
def _build_google_messages(
    self,
    messages: list[tuple[ChatCompletionMessageRole, str, Optional[str], Optional[list[JSONScalarType]]]],
) -> tuple[list["ContentType"], str]:
    """
    Build Google messages following the standard pattern - process ALL messages.

    Handles:
    - USER: Standard user messages
    - AI: Assistant messages (may include function calls)
    - SYSTEM: Collected into system_instruction
    - TOOL: Tool results (converted to function_response in user role)
    """
    google_messages: list["ContentType"] = []
    system_prompts = []

    for role, content, tool_call_id, tool_calls in messages:
        if role == ChatCompletionMessageRole.USER:
            google_messages.append({
                "role": "user",
                "parts": [{"text": content}]
            })

        elif role == ChatCompletionMessageRole.AI:
            parts = []

            # Add text content if present
            if content:
                parts.append({"text": content})

            # Add tool calls if present
            if tool_calls:
                for tool_call in tool_calls:
                    function_data = tool_call.get("function", {})
                    function_name = function_data.get("name", "")

                    # Parse arguments (may be string or dict)
                    args_raw = function_data.get("arguments", {})
                    if isinstance(args_raw, str):
                        try:
                            args_dict = json.loads(args_raw)
                        except json.JSONDecodeError:
                            args_dict = {}
                    else:
                        args_dict = args_raw

                    parts.append({
                        "function_call": {
                            "name": function_name,
                            "args": args_dict,
                        }
                    })

            if parts:
                google_messages.append({
                    "role": "model",
                    "parts": parts
                })

        elif role == ChatCompletionMessageRole.SYSTEM:
            system_prompts.append(content)

        elif role == ChatCompletionMessageRole.TOOL:
            # Google expects tool results in user messages with function_response
            # Parse the content as JSON to get the result
            try:
                result_data = json.loads(content) if content else {}
            except json.JSONDecodeError:
                result_data = {"result": content}

            # The tool_call_id should contain the function name
            # In Phoenix, we might need to extract it from the context
            google_messages.append({
                "role": "user",
                "parts": [{
                    "function_response": {
                        "name": tool_call_id or "",
                        "response": result_data
                    }
                }]
            })
        else:
            assert_never(role)

    return google_messages, "\n".join(system_prompts)
```

### 3.2 Frontend 구현

#### Step 1: Tool choice 지원 목록에 Google 추가

**파일:** `app/src/components/generative/ToolChoiceSelector.tsx`

**위치:** Line 30-40 수정

```typescript
export const DEFAULT_TOOL_CHOICES_BY_PROVIDER = {
  OPENAI: ["required", "auto", "none"] as const,
  AZURE_OPENAI: ["required", "auto", "none"] as const,
  DEEPSEEK: ["required", "auto", "none"] as const,
  XAI: ["required", "auto", "none"] as const,
  OLLAMA: ["required", "auto", "none"] as const,
  ANTHROPIC: ["any", "auto", "none"] as const,
  AWS: ["any", "auto", "none"] as const,
  GOOGLE: ["any", "auto", "none"] as const,  // 새로 추가
} satisfies Partial<
  Record<ModelProvider, (string | Record<string, unknown>)[]>
>;
```

#### Step 2: Tool choice type 추출 로직 업데이트

**파일:** `app/src/components/generative/ToolChoiceSelector.tsx`

**위치:** findToolChoiceType 함수의 GOOGLE case 수정 (Line 87-90)

```typescript
case "GOOGLE":
  // Google uses "any" instead of "required"
  if (
    isObject(choice) &&
    "type" in choice &&
    typeof choice.type === "string"
  ) {
    return choice.type;
  }
  return choice;
```

### 3.3 Schema 업데이트 (선택사항)

**파일:** `app/src/schemas/toolChoiceSchemas.ts`

Google tool choice를 위한 스키마 함수 추가:

```typescript
export const makeGoogleToolChoice = (
  choice: string | { type: string; name?: string }
): unknown => {
  if (typeof choice === "string") {
    return { type: choice };
  }
  return choice;
};

export const GoogleToolChoiceSchema = z.union([
  z.literal("auto"),
  z.literal("any"),
  z.literal("none"),
  z.object({
    type: z.union([
      z.literal("auto"),
      z.literal("any"),
      z.literal("none"),
    ]),
  }),
]);

export type GoogleToolChoice = z.infer<typeof GoogleToolChoiceSchema>;
```

---

## 4. 테스트 방법

### 4.1 단위 테스트

```python
# test_google_tools.py

import pytest
from phoenix.server.api.helpers.playground_clients import GoogleStreamingClient

def test_convert_tools_to_google_format():
    client = GoogleStreamingClient(...)

    phoenix_tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current weather",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"}
                    }
                }
            }
        }
    ]

    result = client._convert_tools_to_google_format(phoenix_tools)

    assert len(result) == 1
    assert result[0]["name"] == "get_weather"
    assert result[0]["description"] == "Get current weather"
    assert "parameters" in result[0]

def test_convert_tool_choice_to_google_mode():
    client = GoogleStreamingClient(...)

    # Test string choices
    assert client._convert_tool_choice_to_google_mode("auto") == "AUTO"
    assert client._convert_tool_choice_to_google_mode("any") == "ANY"
    assert client._convert_tool_choice_to_google_mode("required") == "ANY"
    assert client._convert_tool_choice_to_google_mode("none") == "NONE"

    # Test object choices
    assert client._convert_tool_choice_to_google_mode({"type": "auto"}) == "AUTO"
    assert client._convert_tool_choice_to_google_mode({"type": "any"}) == "ANY"
```

### 4.2 통합 테스트

1. Phoenix UI에서 Google AI Studio provider 선택
2. Tool 추가 버튼 클릭하여 function 정의
3. Tool Choice 드롭다운에서 "Auto", "Any", "None" 선택 가능 확인
4. 프롬프트 실행하여 function call이 정상적으로 반환되는지 확인
5. Tool result를 입력하여 최종 응답이 생성되는지 확인

### 4.3 수동 테스트 예시

**Test Case 1: Weather Function Call**

Tool Definition:
```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get the current weather for a location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "City name"
        }
      },
      "required": ["location"]
    }
  }
}
```

Prompt:
```
What's the weather like in Seoul?
```

Expected Response:
```json
{
  "function_call": {
    "name": "get_weather",
    "arguments": "{\"location\": \"Seoul\"}"
  }
}
```

**Test Case 2: Multiple Tools**

Tool Definitions:
- get_weather
- get_time
- calculate

Prompt:
```
What time is it in New York and what's the weather there?
```

Expected: Model should call both get_time and get_weather functions.

---

## 5. 주의사항

### 5.1 Provider 간 차이점

| 기능 | OpenAI | Anthropic | Google |
|------|--------|-----------|---------|
| Tool Choice "required" | ✅ | ❌ (uses "any") | ❌ (uses "any") |
| Tool Choice "any" | ❌ | ✅ | ✅ |
| Specific function selection | ✅ | ✅ | ❌ |
| Tool call ID | ✅ Provided by API | ✅ Provided by API | ❌ Must generate |
| Tool result role | "tool" | "user" | "user" |
| Response format | ✅ | ❌ | ✅ (as response_schema) |

### 5.2 Google 특이사항

1. **Tool Call ID 생성 필요**
   - Google API는 tool call ID를 제공하지 않음
   - `f"call_{abs(hash(function_name))}"` 형식으로 생성 필요
   - Tool result 메시지에서 function name을 추적하기 위해 tool_call_id에 function name 저장

2. **Tool Choice 매핑**
   - "required" → "any"로 매핑
   - Specific function selection 미지원 (ANY mode로 fallback)

3. **Response Format**
   - OpenAI의 `response_format`을 Google의 `response_schema`로 변환
   - JSON schema만 지원

4. **Tool Result 형식**
   ```python
   # Phoenix format (tool_call_id에 function name 포함)
   ("tool", '{"result": "sunny"}', "get_weather", None)

   # Google format
   {
       "role": "user",
       "parts": [{
           "function_response": {
               "name": "get_weather",
               "response": {"result": "sunny"}
           }
       }]
   }
   ```

### 5.3 에러 처리

```python
# Tool conversion 실패 시
try:
    function_declarations = self._convert_tools_to_google_format(tools)
except Exception as e:
    logger.error(f"Failed to convert tools: {e}")
    # Continue without tools
    function_declarations = []

# Function call 파싱 실패 시
try:
    args_dict = json.loads(args_raw)
except json.JSONDecodeError:
    logger.warning(f"Failed to parse function arguments: {args_raw}")
    args_dict = {}
```

---

## 6. 참고 자료

### 공식 문서
- [Function calling with the Gemini API](https://ai.google.dev/gemini-api/docs/function-calling)
- [Using tools with Gemini API](https://ai.google.dev/gemini-api/docs/tools)
- [Tool use with Live API](https://ai.google.dev/gemini-api/docs/live-tools)
- [Introduction to function calling - Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling)

### 튜토리얼 및 가이드
- [Function Calling Guide: Google DeepMind Gemini 2.0 Flash](https://www.philschmid.de/gemini-function-calling)
- [How to Interact with APIs Using Function Calling in Gemini](https://codelabs.developers.google.com/codelabs/gemini-function-calling)
- [Gemini API: Function calling with Python (Colab)](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Function_calling.ipynb)

### Phoenix 내부 참고
- OpenAI implementation: `playground_clients.py:253-499`
- Anthropic implementation: `playground_clients.py:1482-1682`
- Tool choice schemas: `app/src/schemas/toolChoiceSchemas.ts`
- Tool choice selector: `app/src/components/generative/ToolChoiceSelector.tsx`

---

## 7. 체크리스트

구현 완료 시 다음 항목들을 확인하세요:

### Backend
- [ ] `supported_invocation_parameters`에 tool_choice, response_format 추가
- [ ] `_convert_tools_to_google_format` helper 메서드 구현
- [ ] `_convert_tool_choice_to_google_mode` helper 메서드 구현
- [ ] `chat_completion_create`에서 tools를 Google format으로 변환하여 전달
- [ ] Function call 응답을 ToolCallChunk로 변환하여 yield
- [ ] `_build_google_messages`에서 TOOL role 처리 구현
- [ ] Tool result를 function_response로 변환

### Frontend
- [ ] `DEFAULT_TOOL_CHOICES_BY_PROVIDER`에 GOOGLE 추가
- [ ] `findToolChoiceType`에 GOOGLE case 추가
- [ ] Tool choice selector가 Google에서 정상 작동하는지 확인

### 테스트
- [ ] 단위 테스트 작성 및 통과
- [ ] 단일 tool call 통합 테스트
- [ ] 복수 tool calls 통합 테스트
- [ ] Tool result 왕복 테스트
- [ ] Tool choice 모드별 테스트 (auto, any, none)
- [ ] Response format 테스트

### 문서
- [ ] 코드에 주석 추가
- [ ] CHANGELOG 업데이트
- [ ] 사용자 문서 업데이트

---

## 8. 버전 정보

- **문서 작성일:** 2025-01-24
- **Phoenix 버전:** 12.16.0
- **google-genai 버전:** 1.52.0
- **최신 Gemini 모델:** gemini-2.5-pro, gemini-2.5-flash, gemini-3-pro-preview
- **Google API Knowledge Cutoff:** January 2025
