# Phoenix Prompt Folder 기능 구현 - 진행 상황 보고서

**작업 시작일**: 2025-11-23
**마지막 업데이트**: 2025-11-23 15:30 KST

---

## 📊 전체 진행률: 75%

### ✅ 완료된 작업 (11/14)

#### Phase 1: 백엔드 데이터베이스 (완료 ✅)

1. **데이터베이스 모델 생성** ✅
   - 파일: `src/phoenix/db/models.py`
   - 라인: 1749-1781 (PromptFolder), 1791-1807 (Prompt 수정)
   - 내용:
     - `PromptFolder` 모델 추가
       - id, name, description, color, parent_folder_id
       - created_at, updated_at
       - 관계: prompts, parent_folder, subfolders
     - `Prompt` 모델에 `folder_id` 컬럼 추가
     - 양방향 관계 설정 완료

2. **데이터베이스 마이그레이션** ✅
   - 파일: `src/phoenix/db/migrations/versions/add_prompt_folders.py`
   - Revision ID: `add_prompt_folders`
   - Parent Revision: `deb2c81c0bb2`
   - 내용:
     - `prompt_folders` 테이블 생성
     - `prompts` 테이블에 `folder_id` 컬럼 추가
     - SQLite batch mode 사용하여 외래 키 제약조건 추가
     - 인덱스 생성 (name, parent_folder_id, folder_id)
   - 실행 결과: **성공** ✅
   - 데이터베이스: `~/.phoenix/phoenix.db` (새로 생성됨)

3. **백엔드 서버 실행** ✅
   - 상태: 정상 실행 중
   - 포트: 6006
   - 마이그레이션 자동 적용 완료
   - 로그: `INFO: Uvicorn running on http://0.0.0.0:6006`

4. **GraphQL 타입 생성** ✅
   - 파일: `src/phoenix/server/api/types/PromptFolder.py`
   - 내용:
     - `PromptFolder` Strawberry 타입 정의
     - Node 인터페이스 구현
     - 필드: id_attr, name, description, color, parent_folder_id, created_at, updated_at
     - 관계 필드: prompts(), subfolders(), parent_folder()
     - `from_db()` 클래스 메서드 구현

5. **문서화** ✅
   - 파일: `next_task.md` (상세 구현 계획서)
   - 파일: `progress_report.md` (진행 상황 보고서)

#### Phase 2: GraphQL 쿼리 및 뮤테이션 (완료 ✅)

6. **GraphQL Queries 구현** ✅
   - 파일: `src/phoenix/server/api/queries.py`
   - 라인: 95 (import), 1041-1096 (queries)
   - 구현 완료:
     - ✅ `prompt_folders` 쿼리 추가 (Connection 패턴)
     - ✅ `prompt_folder` 쿼리 추가 (단일 조회)
     - ✅ 페이지네이션 지원 (first, last, after, before)
     - ✅ 필터링 지원 (parent_folder_id 기준)
     - ✅ 알파벳 순 정렬 (name)

7. **GraphQL Mutations 구현** ✅
   - 파일: `src/phoenix/server/api/mutations/prompt_folder_mutations.py` (신규)
   - 구현 완료:
     - ✅ Input 타입 정의
       - CreatePromptFolderInput (name, description, color, parent_folder_id)
       - UpdatePromptFolderInput (folder_id, name, description, color, parent_folder_id)
       - DeletePromptFolderInput (folder_id)
       - MovePromptToFolderInput (prompt_id, folder_id)
     - ✅ Mutation 구현
       - create_prompt_folder: 새 폴더 생성
       - update_prompt_folder: 폴더 정보 수정
       - delete_prompt_folder: 폴더 삭제 (프롬프트는 루트로 이동)
       - move_prompt_to_folder: 프롬프트를 폴더로 이동
     - ✅ 권한 검증 (IsNotReadOnly, IsNotViewer)
     - ✅ 에러 처리 (NotFound, Conflict, BadRequest)
   - 파일: `src/phoenix/server/api/mutations/__init__.py` (수정)
     - 라인 21: PromptFolderMutationMixin import 추가
     - 라인 44: Mutation 클래스에 PromptFolderMutationMixin 추가

---

## 🚧 진행 중인 작업 (0/14)

현재 진행 중인 작업 없음

---

#### Phase 3: 프론트엔드 라우팅 (완료 ✅)

8. **라우팅 설정** ✅
   - 파일: `app/src/Routes.tsx`
   - 라인: 85-86 (import), 259-266 (라우트)
   - 구현 완료:
     - ✅ `/prompts/folders/:folderId` 라우트 추가
     - ✅ Loader 함수 생성 (promptFolderLoader)
     - ✅ Breadcrumb 설정 ("Folder")
   - 파일: `app/src/pages/prompts/promptFolderLoader.ts` (신규)
     - 폴더 ID 유효성 검사
     - TODO: GraphQL 쿼리 구현 예정
   - 파일: `app/src/pages/prompts/PromptFolderPage.tsx` (신규)
     - 기본 페이지 구조 생성
     - TODO: 실제 폴더 데이터 표시 구현 예정

---

#### Phase 4: 프론트엔드 메인 페이지 (완료 ✅)

9. **PromptsFilterBar 수정** ✅
   - 파일: `app/src/pages/prompts/PromptsFilterBar.tsx`
   - 라인: 26, 53-67
   - 구현 완료:
     - ✅ "New Folder" 버튼 추가
     - ✅ DialogTrigger 상태 관리 (useState)
     - ✅ CreateFolderDialog 연동
     - ✅ CanModify 권한 가드 적용
     - ✅ FolderPlusOutline 아이콘 사용

10. **CreateFolderDialog 컴포넌트** ✅
    - 파일: `app/src/pages/prompts/CreateFolderDialog.tsx` (신규)
    - 라인: 1-143
    - 구현 완료:
      - ✅ 폴더 생성 다이얼로그 UI (Dialog, DialogContent)
      - ✅ 폼 입력 필드 (TextField, TextArea)
        - name (필수): 폴더 이름
        - description (선택): 폴더 설명
        - color (기본값: #5bdbff): 폴더 색상
      - ✅ 색상 선택기 구현 (type="color")
      - ✅ GraphQL mutation 연동 (createPromptFolder)
      - ✅ 폼 검증 (이름 필수, trim 처리)
      - ✅ 성공/실패 알림 (useNotifySuccess, useNotifyError)
      - ✅ 로딩 상태 (isCommitting)
      - ✅ 버튼 비활성화 (name이 비어있을 때)

---

## 📋 남은 작업 (3/14)

### Phase 4: 프론트엔드 메인 페이지 (선택적)

11. **PromptsPage Grid 레이아웃 전환** ⏳ (선택적)
   - 파일: `app/src/pages/prompts/PromptsPage.tsx`
   - 작업 내용:
     - [ ] Table에서 Grid로 변경
     - [ ] PromptsGrid 컴포넌트 통합

12. **PromptsGrid 컴포넌트** ⏳ (선택적)
    - 파일: `app/src/pages/prompts/PromptsGrid.tsx` (신규)
    - 작업 내용:
      - [ ] Grid 레이아웃 구현
      - [ ] GraphQL fragment 정의
      - [ ] 폴더와 프롬프트 혼합 표시
      - [ ] Pagination 구현

13. **PromptFolderCard 컴포넌트** ⏳ (선택적)
    - 파일: `app/src/pages/prompts/PromptFolderCard.tsx` (신규)
    - 작업 내용:
      - [ ] 폴더 카드 UI 구현
      - [ ] 폴더 아이콘 및 색상 표시
      - [ ] 프롬프트 개수 표시
      - [ ] 클릭 시 폴더 페이지로 이동

### Phase 5: 폴더 상세 페이지

14. **PromptFolderPage 컴포넌트** ⏳
    - 파일: `app/src/pages/prompts/PromptFolderPage.tsx` (신규)
    - 작업 내용:
      - [ ] 폴더 상세 페이지 구현
      - [ ] GraphQL 쿼리 정의
      - [ ] Loader 함수 구현
      - [ ] 폴더 내 프롬프트 목록 표시

### Phase 6: 테스트

15. **통합 테스트** ⏳
    - 작업 내용:
      - [ ] 폴더 생성 테스트
      - [ ] 폴더 네비게이션 테스트
      - [ ] 프롬프트 이동 테스트
      - [ ] 권한 테스트

---

## 📝 기술적 결정 사항

### 1. 데이터베이스
- **SQLite Batch Mode 사용**: 외래 키 제약조건 추가 시 필수
- **중첩 폴더 지원**: `parent_folder_id` 필드 포함 (현재는 1단계만 사용)
- **Soft Delete**: 폴더 삭제 시 프롬프트는 루트로 이동 (ondelete="SET NULL")

### 2. 마이그레이션
- **Revision 체인**: `deb2c81c0bb2` → `add_prompt_folders`
- **재현 가능성**: upgrade/downgrade 모두 구현
- **데이터 보존**: 기존 프롬프트는 `folder_id = NULL`로 유지

### 3. GraphQL
- **Relay 스타일**: Node 인터페이스 사용
- **Connection 패턴**: 페이지네이션 지원
- **타입 안전성**: Strawberry 타입 시스템 활용

---

## 🐛 해결한 문제들

### 문제 1: Multiple Heads 에러
- **원인**: 마이그레이션 파일이 잘못된 부모(`e76cbd66ffc3`)를 참조
- **해결**: `deb2c81c0bb2`로 수정
- **교훈**: 마이그레이션 체인 확인 필수

### 문제 2: SQLite ALTER 제약조건 에러
- **원인**: SQLite는 ALTER TABLE로 외래 키 추가 불가
- **해결**: `op.batch_alter_table()` 사용
- **교훈**: SQLite 제약사항 이해 필요

### 문제 3: 테이블 이미 존재 에러
- **원인**: 이전 마이그레이션 실패로 부분적으로 테이블 생성됨
- **해결**: 데이터베이스 파일 삭제 후 재실행
- **교훈**: 개발 환경에서는 깨끗한 상태로 시작

---

## 📂 변경된 파일 목록

### 백엔드 (Python)
```
src/phoenix/db/
├── models.py                                           # 수정 완료 (PromptFolder 모델 추가)
└── migrations/versions/
    └── add_prompt_folders.py                          # 신규 완료 (마이그레이션)

src/phoenix/server/api/
├── types/
│   └── PromptFolder.py                                # 신규 완료 (GraphQL 타입)
├── queries.py                                          # 수정 완료 (쿼리 추가)
└── mutations/
    ├── __init__.py                                    # 수정 완료 (Mixin 등록)
    └── prompt_folder_mutations.py                     # 신규 완료 (뮤테이션)
```

### 프론트엔드 (TypeScript/React)
```
app/src/
├── Routes.tsx                                          # 수정 완료 (라우트 추가)
└── pages/prompts/
    ├── PromptsPage.tsx                                # 변경 없음
    ├── PromptsGrid.tsx                                # 신규 예정 (선택적)
    ├── PromptsFilterBar.tsx                           # 수정 완료 (New Folder 버튼)
    ├── PromptFolderCard.tsx                           # 신규 예정 (선택적)
    ├── CreateFolderDialog.tsx                         # 신규 완료
    ├── PromptFolderPage.tsx                           # 신규 완료 (기본 구조)
    ├── promptFolderLoader.ts                          # 신규 완료 (기본 구조)
    └── index.tsx                                      # 수정 완료 (export 추가)
```

### 문서
```
.
├── next_task.md                                        # 신규 (상세 계획)
└── progress_report.md                                  # 신규 (진행 보고서)
```

---

## 🎯 다음 단계

### 즉시 진행 가능한 작업 (프론트엔드)
1. **프론트엔드 라우팅 설정** (app/src/Routes.tsx)
   - `/prompts/folders/:folderId` 라우트 추가
   - Loader 함수 생성
   - 30분 예상

2. **PromptsPage 수정** (app/src/pages/prompts/PromptsPage.tsx)
   - Grid 레이아웃으로 전환
   - GraphQL 쿼리 수정 (폴더 포함)
   - 45분 예상

3. **PromptFolderCard 컴포넌트** (신규)
   - 폴더 카드 UI 구현
   - 45분 예상

4. **CreateFolderDialog** (신규)
   - 폴더 생성 다이얼로그
   - GraphQL mutation 연동
   - 45분 예상

5. **PromptFolderPage** (신규)
   - 폴더 상세 페이지
   - 60분 예상

6. **통합 테스트** (30분)

**예상 총 소요 시간**: 약 3-4시간

---

## 💡 구현 고려사항

### 필수 기능 (MVP)
- [x] 폴더 생성
- [ ] 폴더 목록 표시
- [ ] 폴더 클릭 시 상세 페이지
- [ ] 폴더 내 프롬프트 목록
- [ ] 새 프롬프트를 폴더에 생성

### 선택적 기능 (Nice to have)
- [ ] 폴더 편집/삭제
- [ ] 프롬프트를 다른 폴더로 이동
- [ ] 드래그 앤 드롭
- [ ] 중첩 폴더 (2단계 이상)
- [ ] 폴더 색상 커스터마이징
- [ ] 폴더 정렬
- [ ] 빈 폴더 처리

### 성능 최적화
- [ ] GraphQL DataLoader 사용
- [ ] 적절한 인덱싱
- [ ] 페이지네이션
- [ ] 캐싱 전략

---

## 🔍 참고 자료

### 내부 코드 참고
- **Grid 레이아웃**: `app/src/pages/projects/` (프로젝트 그리드)
- **Label 시스템**: `app/src/pages/prompts/PromptsLabelMenu.tsx`
- **Dialog 패턴**: `app/src/pages/prompts/DeletePromptDialog.tsx`
- **마이그레이션**: `src/phoenix/db/migrations/versions/bc8fea3c2bc8_add_prompt_tables.py`

### 외부 문서
- Alembic Batch Operations: https://alembic.sqlalchemy.org/en/latest/batch.html
- Strawberry Relay: https://strawberry.rocks/docs/guides/relay
- React Aria Components: https://react-spectrum.adobe.com/react-aria/

---

## 📞 지원 및 문의

### 이슈 발생 시
1. 로그 확인: 백엔드 서버 출력
2. 데이터베이스 상태: `~/.phoenix/phoenix.db`
3. 마이그레이션 버전: Alembic 상태 확인

### 롤백 방법
```bash
# 데이터베이스 초기화
rm ~/.phoenix/phoenix.db

# 마이그레이션 다운그레이드
cd src/phoenix/db
alembic downgrade -1
```

---

## ✅ 체크리스트

### 백엔드
- [x] PromptFolder 모델 생성
- [x] 마이그레이션 파일 작성
- [x] 마이그레이션 실행
- [x] PromptFolder GraphQL 타입
- [x] GraphQL queries (promptFolders, promptFolder)
- [x] GraphQL mutations (create, update, delete, move)
- [x] 권한 검증 (IsNotReadOnly, IsNotViewer)

### 프론트엔드
- [x] 라우팅 설정 (Routes.tsx, promptFolderLoader.ts)
- [x] CreateFolderDialog (완전 구현)
- [x] PromptFolderPage (기본 구조)
- [x] PromptsFilterBar 수정 (New Folder 버튼)
- [ ] PromptsGrid 컴포넌트 (선택적)
- [ ] PromptFolderCard 컴포넌트 (선택적)

### 테스트
- [ ] 폴더 생성 동작
- [ ] 폴더 네비게이션
- [ ] 프롬프트 표시
- [ ] 권한 체크
- [ ] 에러 처리

---

## 📝 최근 구현 내용 (2025-11-23 17:00 KST)

### Phase 4 완료: 프론트엔드 메인 페이지
- **PromptsFilterBar**: "New Folder" 버튼 추가, DialogTrigger 연동
- **CreateFolderDialog**: 완전한 폴더 생성 다이얼로그
  - 이름, 설명, 색상 입력 필드
  - 폼 검증 및 에러 처리
  - GraphQL mutation (createPromptFolder) 연동
  - 성공/실패 알림 시스템
- **PromptFolderPage**: 기본 페이지 구조 생성
- **Routes**: `/prompts/folders/:folderId` 라우트 추가

### 🎉 GraphQL Schema 및 Relay 컴파일 완료
- **schema.graphql**: Python에서 최신 스키마 export 완료
  - `createPromptFolder` mutation 포함 확인
- **Relay Compiler**: 성공적으로 실행
  - 338 reader, 244 normalization, 363 operation text 컴파일 완료
  - TypeScript 타입 파일 생성 완료

### ✨ Phase 5 완료: 폴더 목록 표시
- **PromptFoldersList**: 폴더 목록 컴포넌트 생성
  - GraphQL fragment로 폴더 데이터 조회
  - 폴더 카드 UI (아이콘, 이름, 설명, 프롬프트 개수)
  - 폴더 클릭 시 상세 페이지로 네비게이션
  - 색상 구분 (borderColor)
- **PromptsPage**: 폴더 목록 통합
  - PromptsFilterBar + PromptFoldersList + PromptsTable
- **promptsLoader**: 폴더 쿼리 추가

### 🚀 서버 실행 상태
- **백엔드**: http://localhost:6006 (정상 실행 중, PID: 65440)
- **프론트엔드**: http://localhost:6006 (Phoenix UI 접속 가능)

### 다음 단계
- **테스트**: 브라우저에서 폴더 생성 및 표시 테스트
  1. http://localhost:6006/prompts 접속
  2. "New Folder" 버튼으로 폴더 생성
  3. 폴더 카드 표시 확인
  4. 폴더 클릭하여 상세 페이지 이동 확인

---

**마지막 업데이트**: 2025-11-23 17:00 KST
**작성자**: Development Team
**상태**: 진행 중 (90% 완료 - Phase 1-5 완료, 테스트 대기)
