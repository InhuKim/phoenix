# NURI-PHOENIX 배포 가이드

## 목차
- [사전 요구사항](#사전-요구사항)
- [Mac Mini 초기 설정](#mac-mini-초기-설정)
- [배포 프로세스](#배포-프로세스)
- [서비스 관리](#서비스-관리)
- [모니터링](#모니터링)
- [문제 해결](#문제-해결)
- [백업 및 복구](#백업-및-복구)

---

## 사전 요구사항

### 하드웨어
- **Mac Mini (Apple Silicon)** - M1, M2, M3 등
- 최소 8GB RAM (16GB 권장)
- 50GB 이상의 여유 디스크 공간

### 소프트웨어
- macOS Monterey (12.0) 이상
- Docker Desktop for Mac (최신 버전)
- Git

---

## Mac Mini 초기 설정

### 1. Docker Desktop 설치

```bash
# Homebrew를 사용한 설치
brew install --cask docker

# 또는 공식 사이트에서 다운로드
# https://www.docker.com/products/docker-desktop/
```

Docker Desktop 실행 후 설정:
- **Resources > Advanced**에서 메모리를 최소 4GB 이상 할당
- **Apply & Restart** 클릭

### 2. Git 저장소 클론

```bash
# 프로젝트 디렉토리 생성
mkdir -p ~/projects
cd ~/projects

# 저장소 클론 (실제 저장소 URL로 변경)
git clone <your-repository-url> nuri-phoenix
cd nuri-phoenix
```

### 3. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 편집기로 .env 파일 열기
nano .env
# 또는
vim .env
# 또는
code .env  # VSCode 사용 시
```

**.env 파일에서 반드시 변경해야 할 항목:**

```bash
# API Keys (사용할 서비스의 키만 설정하면 됩니다)
OPENAI_API_KEY=sk-...                    # OpenAI API 키
ANTHROPIC_API_KEY=sk-ant-...            # Anthropic (Claude) API 키
GEMINI_API_KEY=...                      # Google Gemini API 키
DEEPSEEK_API_KEY=...                    # DeepSeek API 키
XAI_API_KEY=...                         # xAI (Grok) API 키

# PostgreSQL 비밀번호 (보안을 위해 반드시 변경)
POSTGRES_PASSWORD=strong_password_here

# pgAdmin 비밀번호 (선택사항)
PGADMIN_DEFAULT_EMAIL=admin@yourcompany.com
PGADMIN_DEFAULT_PASSWORD=admin_password_here
```

---

## 배포 프로세스

### 1. 이미지 빌드

```bash
# 프로젝트 디렉토리로 이동
cd ~/projects/nuri-phoenix

# Docker 이미지 빌드 (최초 실행 시 15-20분 소요)
docker-compose -f docker-compose.prod.yml build

# 빌드 진행 상황 확인
# Frontend 빌드 → Backend 빌드 → Production 이미지 생성
```

### 2. 서비스 시작

```bash
# 백그라운드에서 모든 서비스 시작
docker-compose -f docker-compose.prod.yml up -d

# 시작 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# Ctrl+C로 로그 확인 중단 (서비스는 계속 실행됨)
```

### 3. 서비스 상태 확인

```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 예상 출력:
# NAME                 IMAGE              STATUS         PORTS
# nuri-phoenix         nuri-phoenix       Up 2 minutes   0.0.0.0:6006->6006/tcp
# nuri-phoenix-db      postgres:16        Up 2 minutes   0.0.0.0:5432->5432/tcp
# nuri-phoenix-pgadmin pgadmin4           Up 2 minutes   0.0.0.0:5050->80/tcp
```

### 4. 서비스 접속

서비스 시작 후 다음 URL로 접속할 수 있습니다:

- **Phoenix Web UI**: http://localhost:6006
- **pgAdmin** (데이터베이스 관리): http://localhost:5050

### 5. 외부 접속 설정 (사내 네트워크)

Mac Mini의 로컬 IP 주소 확인:

```bash
# IP 주소 확인
ifconfig | grep "inet " | grep -v 127.0.0.1

# 출력 예시: inet 192.168.1.100
```

사내 네트워크의 다른 컴퓨터에서 접속:
- **Phoenix**: http://192.168.1.100:6006
- **pgAdmin**: http://192.168.1.100:5050

---

## 서비스 관리

### 서비스 중지

```bash
# 모든 서비스 중지
docker-compose -f docker-compose.prod.yml stop

# 특정 서비스만 중지
docker-compose -f docker-compose.prod.yml stop phoenix
```

### 서비스 재시작

```bash
# 모든 서비스 재시작
docker-compose -f docker-compose.prod.yml restart

# 특정 서비스만 재시작
docker-compose -f docker-compose.prod.yml restart phoenix
```

### 서비스 완전 종료 (데이터 유지)

```bash
# 컨테이너 종료 및 제거 (볼륨은 유지)
docker-compose -f docker-compose.prod.yml down
```

### 서비스 완전 제거 (데이터 삭제)

```bash
# 컨테이너, 네트워크, 볼륨 모두 제거 (주의!)
docker-compose -f docker-compose.prod.yml down -v

# 이미지도 함께 제거
docker-compose -f docker-compose.prod.yml down -v --rmi all
```

### 로그 확인

```bash
# 전체 로그 확인 (실시간)
docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스 로그만 확인
docker-compose -f docker-compose.prod.yml logs -f phoenix
docker-compose -f docker-compose.prod.yml logs -f db

# 최근 100줄만 확인
docker-compose -f docker-compose.prod.yml logs --tail=100

# 특정 시간 이후 로그 확인
docker-compose -f docker-compose.prod.yml logs --since 2024-01-01T00:00:00
```

### 서비스 업데이트

```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 이미지 재빌드
docker-compose -f docker-compose.prod.yml build

# 3. 서비스 재시작
docker-compose -f docker-compose.prod.yml up -d

# 4. 이전 이미지 정리
docker image prune -f
```

---

## 모니터링

### 1. 리소스 사용량 확인

```bash
# 실시간 리소스 모니터링
docker stats

# 출력 예시:
# CONTAINER ID   NAME                CPU %   MEM USAGE / LIMIT   MEM %
# abc123         nuri-phoenix        2.5%    512MB / 4GB        12.8%
# def456         nuri-phoenix-db     0.5%    256MB / 2GB        12.5%
```

### 2. 컨테이너 내부 접속

```bash
# PostgreSQL 컨테이너 접속
docker-compose -f docker-compose.prod.yml exec db psql -U phoenix -d phoenix_db
```

### 3. Health Check

```bash
# Phoenix 서비스 상태 확인
curl http://localhost:6006/

# 데이터베이스 연결 확인
docker-compose -f docker-compose.prod.yml exec db pg_isready -U phoenix
```

---

## 문제 해결

### Phoenix 서비스가 시작되지 않는 경우

```bash
# 1. 로그 확인
docker-compose -f docker-compose.prod.yml logs phoenix

# 2. 데이터베이스 연결 확인
docker-compose -f docker-compose.prod.yml exec db pg_isready

# 3. 포트 충돌 확인
lsof -i :6006
lsof -i :5432

# 4. 서비스 재시작
docker-compose -f docker-compose.prod.yml restart phoenix
```

### 데이터베이스 접속 오류

```bash
# 1. 데이터베이스 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps db

# 2. 데이터베이스 로그 확인
docker-compose -f docker-compose.prod.yml logs db

# 3. 직접 연결 테스트
docker-compose -f docker-compose.prod.yml exec db psql -U phoenix -d phoenix_db -c "SELECT 1;"
```

### 디스크 공간 부족

```bash
# 사용하지 않는 이미지 제거
docker image prune -a

# 사용하지 않는 볼륨 제거 (주의: 데이터가 삭제될 수 있음)
docker volume prune

# 전체 정리 (주의: 모든 미사용 리소스 제거)
docker system prune -a --volumes
```

### 성능 문제

```bash
# 1. 리소스 사용량 확인
docker stats

# 2. Docker Desktop 설정에서 메모리 증가
# Docker Desktop > Settings > Resources > Advanced > Memory

# 3. PostgreSQL 설정 최적화
# docker-compose.prod.yml의 db 서비스에 환경 변수 추가 가능
```

---

## 백업 및 복구

### 1. 데이터베이스 백업

```bash
# 백업 디렉토리 생성
mkdir -p ~/backups/nuri-phoenix

# PostgreSQL 데이터베이스 백업
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U phoenix -d phoenix_db > ~/backups/nuri-phoenix/backup-$(date +%Y%m%d-%H%M%S).sql

# 압축 백업
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U phoenix -d phoenix_db | gzip > ~/backups/nuri-phoenix/backup-$(date +%Y%m%d-%H%M%S).sql.gz
```

### 2. 자동 백업 스크립트

`backup.sh` 파일 생성:

```bash
#!/bin/bash

BACKUP_DIR=~/backups/nuri-phoenix
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE=$BACKUP_DIR/backup-$DATE.sql.gz

# 백업 디렉토리 생성
mkdir -p $BACKUP_DIR

# 데이터베이스 백업
cd ~/projects/nuri-phoenix
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U phoenix -d phoenix_db | gzip > $BACKUP_FILE

# 7일 이상 된 백업 파일 삭제
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

실행 권한 부여:

```bash
chmod +x backup.sh
```

Crontab 등록 (매일 새벽 3시 자동 백업):

```bash
crontab -e

# 다음 라인 추가:
0 3 * * * ~/projects/nuri-phoenix/backup.sh >> ~/backups/nuri-phoenix/backup.log 2>&1
```

### 3. 데이터베이스 복구

```bash
# 압축된 백업에서 복구
gunzip -c ~/backups/nuri-phoenix/backup-YYYYMMDD-HHMMSS.sql.gz | \
  docker-compose -f docker-compose.prod.yml exec -T db psql -U phoenix -d phoenix_db

# 일반 백업에서 복구
cat ~/backups/nuri-phoenix/backup-YYYYMMDD-HHMMSS.sql | \
  docker-compose -f docker-compose.prod.yml exec -T db psql -U phoenix -d phoenix_db
```

### 4. 전체 볼륨 백업

```bash
# 볼륨 목록 확인
docker volume ls

# 볼륨 백업 (tar 형식)
docker run --rm -v phoenix_postgres_data:/data -v ~/backups:/backup \
  alpine tar czf /backup/postgres_data-$(date +%Y%m%d).tar.gz -C /data .

docker run --rm -v phoenix_phoenix_data:/data -v ~/backups:/backup \
  alpine tar czf /backup/phoenix_data-$(date +%Y%m%d).tar.gz -C /data .
```

### 5. 볼륨 복구

```bash
# 볼륨 복구
docker run --rm -v phoenix_postgres_data:/data -v ~/backups:/backup \
  alpine tar xzf /backup/postgres_data-YYYYMMDD.tar.gz -C /data
```

---

## 시스템 자동 시작 설정

Mac Mini 재부팅 시 자동으로 서비스 시작하려면 Docker Desktop의 "Start Docker Desktop when you log in" 옵션을 활성화하고, `restart: unless-stopped` 정책이 docker-compose.prod.yml에 설정되어 있으므로 자동으로 컨테이너가 시작됩니다.

---

## 보안 권장사항

1. **기본 비밀번호 변경**: `.env` 파일의 모든 비밀번호를 강력한 값으로 변경
2. **방화벽 설정**: 필요한 포트만 열기
3. **HTTPS 설정**: 프로덕션 환경에서는 Nginx + Let's Encrypt 사용 권장
4. **정기 업데이트**: 보안 패치 적용을 위해 정기적으로 이미지 재빌드
5. **백업**: 정기적인 데이터베이스 백업 실행

---

## 빠른 시작 가이드

```bash
# 1. 저장소 클론
git clone <your-repo-url> ~/projects/nuri-phoenix
cd ~/projects/nuri-phoenix

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일 편집하여 API 키 입력

# 3. 서비스 시작
docker-compose -f docker-compose.prod.yml up -d

# 4. 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 5. 웹 브라우저에서 접속
# http://localhost:6006
```

---

## 참고 자료

- [Phoenix 공식 문서](https://docs.arize.com/phoenix/)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)

---

## 생성된 파일 목록

이 배포 설정으로 생성된 파일들:

- `Dockerfile.prod` - 프로덕션용 Docker 이미지 빌드 파일
- `docker-compose.prod.yml` - 프로덕션용 Docker Compose 설정
- `.env.example` - 환경 변수 예시 파일
- `DEPLOYMENT.md` - 이 배포 가이드 문서

---

## 문의 및 지원

문제가 발생하거나 질문이 있으시면 내부 지원 채널을 통해 문의하세요.
