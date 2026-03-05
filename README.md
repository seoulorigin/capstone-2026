# capstone-2026
실무중심산학협력프로젝트 2분반

# Git 협업 및 브랜치 전략 가이드

## 1. 브랜치 구조
```
main (배포 또는 제출 가능한 안정 버전)
  develop (기능이 통합되는 개발 브랜치)
    feature/* (기능 개발을 위한 작업 브랜치)
```

## 2. 기본 작업 흐름
```
1. Issue 생성
2. feature 브랜치 생성
3. Pull Request 생성 (feature -> develop)
4. Review 이후 merge 진행
5. 배포 시 develop -> main
```

## 3. feature 브랜치 생성 방법
작업 시작 전 항상 `develop`를 최신 상태로 업데이트합니다.
```
git checkout develop
git pull
```

새 기능 작업 시 브랜치 생성
```
git checkout -b feature/<feature-name>
```
예시
```
ex. git checkout -b feature/login
```

## 4. 커밋 메시지 규칙
커밋 메시지는 다음 형식을 사용합니다.
```
tyep: 작업 내용
```
예시
```
feat: 로그인 기능 추가
fix: 채팅 메시지 오류 수정
```

## 5. Issue 사용 규칙
**모든 작업은 Issue 생성 후 시작합니다.**  
```
1. feature (기능 개발)
2. bug (버그 발생)
3. task (작업 보고)
```
예시
```
[FEAT] 로그인 기능 구현
[BUG] 메시지 전송 오류 발생
[TASK] README.md 수정
```

## 6. Branch Protection Rules  
프로젝트의 안정적인 협업을 위해 **GitHub Branch Protection**을 사용합니다.  
`develop`과 `main` 브랜치에는 아래와 같은 규칙이 적용됩니다.
### 6.1. develop
1. `develop` 브랜치에는 직접 **push**할 수 없습니다.
2. 모든 변경 사항은 **PR**을 통해서만 **Merge**됩니다.
3. **PR**이 **Merge**되기 전에 설정된 **CI 검사**가 통과해야 합니다.
4. **PR**에 남겨진 *Review Comment**가 모두 해결되어야 **Merge**가 가능합니다.

### 6.2. main
1. `main` 브랜치에는 직접 **push**할 수 없습니다.
2. `develop` 브랜치에는 **PR**을 통해서만 **Merge**할 수 있습니다.
3. **PR**이 **Merge**되기 전에 설정된 **CI 검사**가 통과해야 합니다.
