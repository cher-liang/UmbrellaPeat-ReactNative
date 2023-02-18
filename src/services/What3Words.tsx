import { THREE_WORDS_API_KEY } from "@env";

const get3Words = (latitude:number,longitude:number) => {
    return fetch(encodeURI(`https://api.what3words.com/v3/convert-to-3wa?coordinates=${latitude},${longitude}&key=${THREE_WORDS_API_KEY}`))
        .then(response => response.json())
        .then(json => {
            return json.words;
        })
        .catch(error => {
            console.error(error);
        });
};

export default get3Words;