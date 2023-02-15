import useScrollListener from "../../../../lib/Hooks";
import React, { useEffect, useState, useCallback } from "react";
import { animated, useSpring } from "react-spring";

export function debounce(func: () => void, wait: number, immediate: boolean) {
  let timeout: any;
  return function () {
    // @ts-ignore
    const context = this as any;
    const args = arguments as any;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const ScrollNav = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;

    console.log("currentScrollPos", currentScrollPos);
    console.log("prevScrollPos", prevScrollPos);
    console.log(
      " prevScrollPos - currentScrollPos",
      prevScrollPos - currentScrollPos
    );

    const bla =
      (prevScrollPos > currentScrollPos &&
        prevScrollPos - currentScrollPos > 70) ||
      currentScrollPos < 10;
    setVisible(bla);

    console.log("bla", bla);

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos, setPrevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  const hidden = visible ? "" : "hidden";

  const styles = useSpring({
    to: { y: visible ? 0 : -200 },
    from: { y: 0 },
    config: { duration: 250 },
  });

  return (
    <animated.div
      style={styles}
      className={`h-16 sticky top-0 bg-gray-300 opacity-80 ${hidden}
       z-50`}
    >
      1
    </animated.div>
  );
};

export default ScrollNav;
