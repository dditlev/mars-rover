/**
 * Consume the autoplay stream from index to (index + take)
 * @param {number} from from index
 * @param {number} take take N amount
 * @param {function} setData cb that receives the data
 * @returns Promise
 */
 const fetchStream = (from, take, setData) =>
 fetch(`/rover-api/autoplay?from=${from}&take=${take}`, {
   cache: "no-store",
 }).then(async (res) => {
   const reader = res.body.getReader();
   const enc = new TextDecoder("utf-8");

   let done;
   let value;
   let buffer = "";
   const commit = (mergedData) => {
     setTimeout(() => {
       setData(JSON.parse(mergedData.trim()));
     }, 1);
   };
   while (!done) {
     ({ value, done } = await reader.read());
     if (done) {
      return
     }
     const decodedString = enc.decode(value);
     if (decodedString.includes("\n")) {
       const split = decodedString.split("\n");
       commit(buffer + split[0]);
       buffer = split[1];
     } else {
       buffer = buffer + decodedString;
     }
   }
 });
 export default fetchStream