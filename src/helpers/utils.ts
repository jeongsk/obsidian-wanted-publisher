/**
 * 파일명에서 허용되지 않는 특수 문자를 제거하는 함수
 * @param filename 정리할 파일명
 * @returns 특수 문자가 제거된 파일명
 */
export function cleanFilename(filename: string): string {
	// 허용되지 않는 특수 문자 패턴
	// Windows와 Unix 시스템에서 일반적으로 허용되지 않는 문자들
	const pattern = /[<>:"/\\|?*\x00-\x1F]/g;

	// 정규식을 사용하여 허용되지 않는 문자 제거
	const cleanedFilename: string = filename.replace(pattern, "");

	return cleanedFilename;
}
