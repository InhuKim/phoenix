# Phoenix Prompt Folder 기능 구현 계획

## 📋 프로젝트 개요
기존 Prompts 페이지에 폴더링 기능을 추가하여 프롬프트를 체계적으로 관리할 수 있도록 함

---

## ✅ 구현 완료 사항
- [x] 현재 시스템 분석 완료
- [x] 데이터베이스 스키마 설계 완료
- [x] 프론트엔드 구조 설계 완료
- [x] GraphQL 스키마 설계 완료

---

## 🚀 구현 작업 순서

### Phase 1: 백엔드 기초 작업
1. ✅ 데이터베이스 모델 생성
   - [ ] `PromptFolder` 모델 추가 (src/phoenix/db/models.py)
   - [ ] `Prompt` 모델에 `folder_id` 컬럼 추가
   - [ ] Relationship 설정

2. ✅ 데이터베이스 마이그레이션
   - [ ] Alembic 마이그레이션 파일 생성
   - [ ] `prompt_folders` 테이블 생성
   - [ ] `prompts` 테이블에 `folder_id` 컬럼 추가
   - [ ] 인덱스 생성
   - [ ] 마이그레이션 실행 및 테스트

3. ✅ GraphQL 타입 정의
   - [ ] `PromptFolder` 타입 생성 (src/phoenix/server/api/types/PromptFolder.py)
   - [ ] Input 타입 정의 (CreatePromptFolderInput, UpdatePromptFolderInput 등)
   - [ ] Payload 타입 정의

4. ✅ GraphQL Queries 구현
   - [ ] `promptFolders` 쿼리 구현 (src/phoenix/server/api/queries.py)
   - [ ] `promptFolder` 쿼리 구현
   - [ ] 페이지네이션 지원
   - [ ] 필터링 지원 (parent_folder_id)

5. ✅ GraphQL Mutations 구현
   - [ ] `createPromptFolder` 뮤테이션 (src/phoenix/server/api/mutations/prompt_folder_mutations.py)
   - [ ] `updatePromptFolder` 뮤테이션
   - [ ] `deletePromptFolder` 뮤테이션
   - [ ] `movePromptToFolder` 뮤테이션
   - [ ] 권한 검증 추가 (IsNotReadOnly, IsNotViewer)

### Phase 2: 프론트엔드 기초 컴포넌트
6. ✅ 라우팅 설정
   - [ ] `/prompts/folders/:folderId` 라우트 추가 (app/src/Routes.tsx)
   - [ ] Loader 함수 생성 (promptFolderLoader)
   - [ ] Breadcrumb 설정

7. ✅ PromptsGrid 컴포넌트 생성
   - [ ] Grid 레이아웃 구현 (app/src/pages/prompts/PromptsGrid.tsx)
   - [ ] GraphQL fragment 정의
   - [ ] Pagination 구현
   - [ ] 폴더와 프롬프트 혼합 표시

8. ✅ PromptFolderCard 컴포넌트
   - [ ] 폴더 카드 UI 구현 (app/src/pages/prompts/PromptFolderCard.tsx)
   - [ ] 폴더 아이콘 및 색상 표시
   - [ ] 프롬프트 개수 표시
   - [ ] 호버 효과 구현
   - [ ] 클릭 시 폴더 페이지로 이동

9. ✅ CreateFolderDialog 컴포넌트
   - [ ] 폴더 생성 다이얼로그 UI (app/src/pages/prompts/CreateFolderDialog.tsx)
   - [ ] 폼 입력 (name, description, color)
   - [ ] 색상 선택기 구현
   - [ ] GraphQL mutation 연동
   - [ ] 유효성 검증

### Phase 3: 메인 페이지 수정
10. ✅ PromptsPage 수정
    - [ ] Table에서 Grid 레이아웃으로 전환 (app/src/pages/prompts/PromptsPage.tsx)
    - [ ] PromptsGrid 컴포넌트 통합
    - [ ] 기존 필터 기능 유지

11. ✅ PromptsFilterBar 수정
    - [ ] "New Prompt" 버튼을 "New Folder" 버튼으로 변경 (app/src/pages/prompts/PromptsFilterBar.tsx)
    - [ ] CreateFolderDialog 연동
    - [ ] 아이콘 변경 (MessageSquareOutline → FolderPlusOutline)

### Phase 4: 폴더 상세 페이지
12. ✅ PromptFolderPage 컴포넌트
    - [ ] 폴더 상세 페이지 구현 (app/src/pages/prompts/PromptFolderPage.tsx)
    - [ ] GraphQL 쿼리 정의
    - [ ] Loader 함수 구현
    - [ ] 에러 처리 (폴더 없음)

13. ✅ PromptFolderHeader 컴포넌트
    - [ ] 폴더 정보 헤더 구현 (app/src/pages/prompts/PromptFolderHeader.tsx)
    - [ ] 폴더 이름, 설명, 색상 표시
    - [ ] 폴더 편집/삭제 액션 메뉴
    - [ ] Breadcrumb 네비게이션

14. ✅ PromptFolderContent 컴포넌트
    - [ ] 폴더 내 프롬프트 목록 표시 (app/src/pages/prompts/PromptFolderContent.tsx)
    - [ ] 기존 PromptsTable 재사용
    - [ ] 필터링 적용 (현재 폴더만)

15. ✅ PromptFolderFilterBar 컴포넌트
    - [ ] 폴더 내 필터 바 구현 (app/src/pages/prompts/PromptFolderFilterBar.tsx)
    - [ ] "New Prompt" 버튼 추가
    - [ ] 폴더 컨텍스트 전달
    - [ ] Playground로 이동 시 folderId 파라미터 전달

### Phase 5: 추가 기능
16. ✅ 프롬프트 이동 기능
    - [ ] 드래그 앤 드롭 UI 구현
    - [ ] `movePromptToFolder` mutation 연동
    - [ ] 시각적 피드백 추가

17. ✅ 폴더 편집/삭제 기능
    - [ ] UpdateFolderDialog 컴포넌트
    - [ ] DeleteFolderDialog 컴포넌트
    - [ ] 폴더 삭제 시 프롬프트 처리 (루트로 이동)
    - [ ] 확인 메시지

18. ✅ 빈 상태 처리
    - [ ] 폴더가 없을 때 Empty State
    - [ ] 폴더 내 프롬프트가 없을 때 Empty State
    - [ ] 가이드 메시지 추가

### Phase 6: 테스트 및 완료
19. ✅ 통합 테스트
    - [ ] 폴더 생성 테스트
    - [ ] 폴더 내비게이션 테스트
    - [ ] 프롬프트 이동 테스트
    - [ ] 폴더 삭제 테스트
    - [ ] 권한 테스트

20. ✅ UI/UX 개선
    - [ ] 로딩 상태 추가
    - [ ] 에러 처리 개선
    - [ ] 애니메이션 추가
    - [ ] 반응형 디자인 확인

21. ✅ 문서화
    - [ ] API 문서 업데이트
    - [ ] 사용자 가이드 작성
    - [ ] 개발자 문서 업데이트

---

## 🔍 추가 고려사항

### 1. 중첩 폴더 지원
- **현재 계획**: 1단계 폴더만 지원 (루트 직속 폴더)
- **향후 확장**: `parent_folder_id`를 활용하여 다단계 폴더 구조 지원 가능
- **구현 복잡도**: 중첩 폴더 구현 시 UI/UX가 복잡해짐
- **권장사항**: 초기에는 1단계만 구현하고, 사용자 피드백 후 확장

### 2. 폴더 정렬 및 순서
- 폴더와 프롬프트의 표시 순서 정의 필요
- 폴더 우선 → 이름순 정렬 (알파벳)
- 사용자 정의 정렬 기능은 추후 추가 고려

### 3. 폴더 색상 팔레트
- 미리 정의된 색상 팔레트 제공
- 사용자가 선택할 수 있는 8-12개 색상
- 기본 색상: `#5bdbff` (Phoenix 브랜드 컬러)

### 4. 프롬프트 이동 UX
- **방법 1**: 드래그 앤 드롭
- **방법 2**: 프롬프트 액션 메뉴에서 "Move to folder" 옵션
- **권장사항**: 두 가지 방법 모두 제공

### 5. 폴더 삭제 정책
- **현재 계획**: 폴더 삭제 시 하위 프롬프트는 루트로 이동
- **대안**: 하위 프롬프트도 함께 삭제 (위험, 확인 필요)
- **권장사항**: 안전한 방식(루트 이동) 채택

### 6. 검색 및 필터 동작
- **전체 검색**: 모든 폴더의 프롬프트 검색
- **폴더 내 검색**: 현재 폴더만 검색
- 검색 결과에서 폴더 경로 표시 (Breadcrumb)

### 7. 권한 관리
- 읽기 전용 사용자: 폴더 조회만 가능
- 일반 사용자: 폴더 생성/수정/삭제 가능
- 기존 `CanModify`, `IsNotReadOnly`, `IsNotViewer` 활용

### 8. 성능 최적화
- 폴더 목록 캐싱
- 무한 스크롤 페이지네이션
- 프롬프트 카드 가상화 (많은 항목 시)

### 9. 모바일 대응
- 그리드 레이아웃 반응형 조정
- 터치 제스처 지원
- 모바일에서 드래그 앤 드롭 대체 UI

### 10. 기존 프롬프트 마이그레이션
- 기존 프롬프트는 모두 `folder_id = null` (루트)
- 사용자가 원하는 폴더로 이동 가능
- 마이그레이션 스크립트 불필요

---

## 📦 필요한 리소스

### 아이콘
- ✅ `FolderOutline`: 폴더 아이콘
- ✅ `FolderPlusOutline`: 폴더 추가 아이콘
- ❓ `FolderOpenOutline`: 열린 폴더 아이콘 (선택사항)
- ❓ `MoveOutline`: 이동 아이콘 (선택사항)

### 색상 팔레트 (권장)
```typescript
const FOLDER_COLORS = [
  '#5bdbff', // 기본 (Phoenix 파란색)
  '#ff6b6b', // 빨강
  '#51cf66', // 초록
  '#ffd43b', // 노랑
  '#ff8c42', // 주황
  '#a78bfa', // 보라
  '#f472b6', // 핑크
  '#06b6d4', // 청록
  '#8b5cf6', // 인디고
  '#64748b', // 회색
];
```

### 컴포넌트 라이브러리
- ✅ Dialog (기존 사용)
- ✅ Form, TextField (기존 사용)
- ✅ Button, LinkButton (기존 사용)
- ❓ ColorPicker (신규 필요 또는 간단한 팔레트 선택기 구현)
- ❓ DragAndDrop (react-dnd 또는 @dnd-kit 고려)

---

## 🎯 우선순위

### High Priority (MVP)
1. 데이터베이스 모델 및 마이그레이션
2. GraphQL 쿼리/뮤테이션
3. PromptsPage Grid 레이아웃 전환
4. PromptFolderCard 컴포넌트
5. CreateFolderDialog
6. PromptFolderPage 기본 구현
7. 폴더 네비게이션

### Medium Priority
8. 프롬프트 이동 기능 (액션 메뉴 방식)
9. 폴더 편집/삭제
10. Empty State 처리
11. 에러 처리

### Low Priority (Nice to have)
12. 드래그 앤 드롭
13. 중첩 폴더 지원
14. 고급 정렬/필터
15. 폴더 즐겨찾기
16. 폴더 통계 (프롬프트 수, 최근 사용 등)

---

## 📝 구현 시 주의사항

1. **GraphQL Schema 변경**
   - 스키마 변경 후 `pnpm run build:relay` 실행 필수
   - 타입 생성 확인

2. **데이터베이스 마이그레이션**
   - 마이그레이션 전 백업 권장
   - 개발 환경에서 충분히 테스트
   - `upgrade()`, `downgrade()` 모두 구현

3. **기존 코드 영향**
   - PromptsTable은 폴더 내에서도 재사용
   - 기존 라벨 필터 기능 유지
   - 기존 검색 기능 유지

4. **권한 체크**
   - 모든 mutation에 권한 체크 추가
   - 프론트엔드에서도 `CanModify` 활용

5. **성능**
   - N+1 쿼리 문제 주의
   - DataLoader 활용 고려
   - 적절한 인덱스 설정

6. **사용자 경험**
   - 로딩 상태 표시
   - 에러 메시지 명확히
   - 성공 토스트 메시지
   - 확인 다이얼로그 (삭제 등)

---

## 🚀 시작 명령어

```bash
# 백엔드 개발 서버
cd app
pnpm run dev:offline

# 프론트엔드 개발 서버 (별도 터미널)
cd app
pnpm run dev:ui

# 데이터베이스 마이그레이션 생성
cd src/phoenix/db/migrations
alembic revision --autogenerate -m "add prompt folders"

# 마이그레이션 실행
alembic upgrade head

# GraphQL 스키마 컴파일
cd app
pnpm run build:relay

# 타입 체크
cd app
pnpm run typecheck
```

---

## 📚 참고 파일

### 백엔드
- `src/phoenix/db/models.py` - 데이터베이스 모델
- `src/phoenix/db/migrations/versions/` - 마이그레이션 파일들
- `src/phoenix/server/api/types/` - GraphQL 타입들
- `src/phoenix/server/api/queries.py` - GraphQL 쿼리들
- `src/phoenix/server/api/mutations/` - GraphQL 뮤테이션들

### 프론트엔드
- `app/src/Routes.tsx` - 라우팅 설정
- `app/src/pages/prompts/` - Prompts 페이지 관련 컴포넌트들
- `app/src/components/` - 재사용 가능한 UI 컴포넌트들
- `app/schema.graphql` - GraphQL 스키마 정의

### 참고용 기존 구현
- `app/src/pages/projects/` - Grid 레이아웃 참고
- `app/src/pages/datasets/` - 폴더링과 유사한 구조 참고 (Labels)

---

## ✅ 완료 체크리스트

구현이 완료되면 다음을 확인:

- [ ] 데이터베이스 마이그레이션 성공
- [ ] GraphQL 쿼리/뮤테이션 동작 확인
- [ ] /prompts 페이지에서 폴더 생성 가능
- [ ] 폴더 카드 클릭 시 폴더 페이지로 이동
- [ ] 폴더 내에서 New Prompt 버튼 동작
- [ ] 프롬프트를 폴더로 이동 가능
- [ ] 폴더 편집/삭제 가능
- [ ] 빈 폴더 표시 정상 동작
- [ ] 검색/필터 기능 정상 동작
- [ ] 권한에 따른 UI 표시 정상
- [ ] 에러 처리 정상
- [ ] 로딩 상태 표시 정상
- [ ] 모바일/태블릿 반응형 확인
- [ ] 타입 에러 없음
- [ ] 린팅 에러 없음

---

**작업 시작일**: 2025-11-23
**예상 완료일**: TBD
**담당자**: Development Team
