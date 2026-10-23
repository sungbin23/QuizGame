import re

def validate_quiz():
    print("🔍 [Quiz Validator] quiz-data.js 할루시네이션 방지 가이드라인을 검증합니다...\n")
    
    try:
        with open('quiz-data.js', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ quiz-data.js 파일을 찾을 수 없습니다.")
        return

    # 문제 텍스트 추출
    questions = re.findall(r'question:\s*"(.*?)"', content)
    keywords = ["가장", "최초", "최대", "세계에서"]
    
    issues_found = 0
    print(f"📋 총 {len(questions)}개의 문제 검사를 시작합니다.\n")

    for i, q in enumerate(questions):
        for keyword in keywords:
            if keyword in q:
                print(f"⚠️ [문제 {i+1} 점검 대상] 최상급/범위 표현 '{keyword}' 발견!")
                print(f"   내용: {q}")
                print(f"   가이드라인: 측정 기준(예: 2024년 기준, 전통적 측정 기준 등)이 제대로 밝혀졌는지 확인하세요.\n")
                issues_found += 1
                break
                
    if issues_found == 0:
        print("✅ 검사 완료: 모호한 최상급 표현 없이 완벽하게 작성되었습니다!")
    else:
        print(f"💡 총 {issues_found}개의 문제에 명확한 검증 기준 적용 여부를 확인하세요.")

if __name__ == "__main__":
    validate_quiz()