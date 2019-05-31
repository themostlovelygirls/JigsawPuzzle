const levelTable = ['进士', '贡士', '举人', '秀才', '童生', ];
const downLimit = [40, 30, 20, 10]

const batttleLevelTable = ['状元', '榜样', '探花', '传胪',];
const battleDownLimit = [45, 30, 15]
var levelTool = {
    getLevel(level) {
        let low = 0;
        let high = downLimit.length - 1;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (level < downLimit[mid]) {
                low = mid + 1;
            } else if (level > downLimit[mid]) {
                high = mid - 1;
            } else {
                return levelTable[mid];
            }
        }

        return levelTable[low];
    },

    getBattleLevel(level) {
        let low = 0;
        let high = battleDownLimit.length - 1;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (level < battleDownLimit[mid]) {
                low = mid + 1;
            } else if (level > battleDownLimit[mid]) {
                high = mid - 1;
            } else {
                return batttleLevelTable[mid];
            }
        }

        return batttleLevelTable[low];
    }

}

module.exports = levelTool;