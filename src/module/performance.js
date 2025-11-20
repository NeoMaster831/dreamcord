export function calculatePP(challengeInfo) {
  if (!challengeInfo) return null;

  const {
    difficulty,
    cnt_solvers,
    hitcount
  } = challengeInfo;

  try {

      const basePP = 10 * 1.5 ** difficulty; // Base PP
      const solveRate = cnt_solvers / hitcount * 100;  // 풀이 성공률 (%)
      const ppMultiplier1 = 10 / solveRate; // 10%를 기본 PP로 적용
      const ppMultiplier2 = 2 / Math.log10(Math.max(100, 100 + cnt_solvers)); // 풀이자 수가 많을 수록 패널티 (100명을 기본으로 둠)
      const ppMultiplier3 = 3 / Math.log10(Math.max(1000, 1000 + hitcount)); // 조회수가 많을 수록 패널티 (1000명을 기본으로 둠)

      const pp = basePP * ppMultiplier1 * ppMultiplier2 * ppMultiplier3;

      return pp;

  } catch (error) {
    console.error('PP 계산 중 오류:', error);
    return null;
  }
}