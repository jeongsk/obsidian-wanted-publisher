# Wanted Social Obsidian Plugin (Unofficial)

Wanted Social Plugin은 [Obsidian](https://obsidian.md/)에서 작성한 노트를 Wanted 소셜 플랫폼에 쉽게 게시할 수 있게 해주는 플러그인입니다.

## 특징 및 장점

- Obsidian에서 직접 Wanted 소셜로 게시물 발행
- Markdown 형식 지원으로 편리한 글 작성
- 기존 게시물 업데이트 지원
- 간편한 사용자 인터페이스

## 설치 방법

이 플러그인은 BRAT(Obsidian Beta Reviewers Auto-update Tester)를 통해 설치할 수 있습니다.

1. Obsidian에서 [BRAT 플러그인](https://obsidian.md/plugins?id=obsidian42-brat)을 먼저 설치하세요. (커뮤니티 플러그인에서 "BRAT"를 검색하여 설치)
2. BRAT을 활성화하고 BRAT 설정으로 이동하세요.
3. "Add Beta plugin" 섹션에서 다음 저장소 주소를 입력하세요: `https://github.com/jeongsk/obsidian-wanted-social`
4. "Add plugin" 버튼을 클릭하세요.
5. 커뮤니티 플러그인 목록으로 이동하여 "Wanted Social"를 찾아 활성화하세요.

## 사용 방법

1. Obsidian에서 Wanted 소셜에 발행할 노트를 엽니다.
2. 명령어 팔레트를 열고(Ctrl/Cmd + P) "Wanted Social"를 검색합니다.
3. "Wanted Social: Publish"을 선택합니다.
4. 게시물 제목을 확인하고 필요하다면 수정합니다.
5. "Publish" 버튼을 클릭하여 게시물을 발행합니다.

## 기능

- [x] 원티드 소셜에 신규 게시물 업로드
- [x] 원티드 소셜에 기존 게시물 업데이트
- [ ] 게시물에 태그 추가(예정)
- [ ] 이미지 업로드 지원(예정)

> **TIP**: 이미지 업로드 기능을 아직 지원하지 않으므로 [Imgur 플러그인](https://obsidian.md/plugins?id=obsidian-imgur-plugin)을 사용하는 것을 추천합니다.

## 설정

플러그인 설정에서 AccessToken을 입력해야 합니다.

**AccessToken 획득 방법:**

1. 웹 브라우저에서 원티드 소셜에 로그인합니다.
2. 브라우저의 개발자 도구를 엽니다 (보통 F12 키).
3. 개발자 도구의 "Application" 또는 "저장소" 탭으로 이동합니다.
4. 왼쪽 사이드바에서 "Cookies"를 클릭하고 원티드 도메인을 선택합니다.
5. `WWW_ONEID_ACCESS_TOKEN` 값을 찾아 복사합니다.
6. 복사한 값을 Obsidian의 Wanted Social 플러그인 설정의 AccessToken 필드에 붙여넣습니다.

## 향후 계획

- 게시물에 태그 추가 기능 구현
- 이미지 직접 업로드 지원
- 게시물 미리보기 기능 추가
- 게시물 초안 저장 기능 구현

## 지원

문제가 발생하거나 제안사항이 있으시면 [이슈 트래커](https://github.com/jeongsk/obsidian-wanted-publisher/issues)에 등록해 주세요.

## 기여

이 프로젝트에 기여하고 싶으시다면 [Pull Request](https://github.com/jeongsk/obsidian-wanted-publisher/pulls)를 보내주세요. 모든 기여를 환영합니다!

## 라이선스

[MIT License](License.txt)
