import emojiList from '../../data/emoji-list.json';

const emojiMap = {};

emojiList.forEach((emojiListObject) => {
    emojiMap[emojiListObject.unified] = emojiListObject;
});

export default emojiMap;