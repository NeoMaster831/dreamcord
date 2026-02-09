import { calculatePP } from './performance.js';

export async function buildSolvedMessage(challengeId, tabId, test = false) {
  let challengeInfo = null;

  try {
    const response = await fetch(`https://dreamhack.io/api/v1/wargame/challenges/${challengeId}/`);
    if (response.ok) {
      challengeInfo = await response.json();
    }
  } catch (error) {
    console.error('문제 정보 가져오기 실패:', error);
  }

  let player = null;
  if (Number.isInteger(tabId) && tabId >= 0) {
    player = await chrome.tabs.sendMessage(tabId, {
      type: 'PROFILE_REQUEST'
    });
  } else {
    try {
      const player_idx = challengeInfo.cnt_solvers - 1; // 바로바로 업데이트가 되는 것을 확인했기 때문에, 솔버 수에서 1을 빼줘야 합니다.
      const response = await fetch(`https://dreamhack.io/api/v1/wargame/challenges/${challengeId}/solvers/?limit=1&offset=${player_idx}&ordering=solved_at`);
      if (response.ok) {
        const data = await response.json();
        player = data.results[0].user;
      }
    } catch (error) {
      console.error('플레이어 정보 가져오기 실패:', error);
    }
  }

  let valid = challengeInfo && player;
  const rate = valid ? challengeInfo.cnt_solvers / challengeInfo.hitcount * 100 : 'N/A';
  const level_color = 1 <= challengeInfo.difficulty && challengeInfo.difficulty <= 3 ? 0x43B581 :
                      4 <= challengeInfo.difficulty && challengeInfo.difficulty <= 6 ? 0x09BAF9 :
                      7 <= challengeInfo.difficulty && challengeInfo.difficulty <= 8 ? 0x013CC7 :
                      9 === challengeInfo.difficulty ? 0xFC4749 :
                      10 === challengeInfo.difficulty ? 0xC90002 :
                      0xFFFFFF;

  const pp = calculatePP(challengeInfo);
  valid = pp ? valid : false;

  // idk who will exploit this, but it's better to be safe than sorry.
  player.introduction = player.introduction.replace('`', "'");
  player.nickname = player.nickname.replace('`', "'");

  if (!valid){
    console.error(player, pp);
  }

  return {
    content: "",
    embeds: [{
      title: valid ? `🎉 ${challengeInfo.title} 문제 해결!` : `🎉 Challenge #${challengeId} 문제 해결!`,
      description: valid ?
        `**해결자**\n` + `[\`${player.nickname}\`](https://dreamhack.io/users/${player.id})` +
        (player.introduction ? ` | \`${player.introduction}\`\n\n` : '\n\n') +
        `**난이도**\n` + `LEVEL ${challengeInfo.difficulty}\n\n` +
        `**태그**\n` + `${challengeInfo.tags.map(tag => `#${tag}`).join(', ')}\n\n` +
        `**솔버 수**\n` + `${challengeInfo.cnt_solvers} solved / ${challengeInfo.hitcount} viewed` + (rate < 2 ? ` **(${rate.toFixed(2)}%)**\n\n` : ` (${rate.toFixed(2)}%)\n\n`) +
        `**예상되는 퍼포먼스**\n${pp.toFixed(2)}pp` + (test ? `\n\n*이 메시지는 웹훅 테스트 메시지이며, 실제로 풀이된 것이 아닙니다.*` : '')
        :
        `Challenge #${challengeId}를 해결했습니다!` + (test ? `\n\n*이 메시지는 웹훅 테스트 메시지이며, 실제로 풀이된 것이 아닙니다.*` : ''),
      color: level_color,
      url: `https://dreamhack.io/wargame/challenges/${challengeId}`,
      timestamp: new Date().toISOString(),

      // It is safe to use the raw player input object because Dreamhack and Discord will block exploits.
      ...(player ? { thumbnail: { url: player.profile_image || 'https://static.dreamhack.io/main/v2/img/amo.1a05d65.png' } } : {}),
    }]
  };
}
