/**
 * useKeypress to listen for keypresses in componenets
 * @param {object} trigger what keypress triggers the hook? trigger.{key, keyCode, value}
 * @param {function} handler callback when the key triggers
 */
export default function useKeypress(trigger, handler) {
  React.useEffect(() => {
    const onEvent = (event) => {
      if (event.key === trigger.key || event.keyCode === trigger.keyCode) {
        handler(trigger.value);
      }
    };
    document.addEventListener("keyup", onEvent);
    return () => document.removeEventListener("keyup", onEvent);
  }, [trigger.value]);
}
