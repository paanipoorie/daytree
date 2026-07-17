import { motion } from "framer-motion";

export default function GrowingTree() {
  const duration = 3;
  const repeat = Infinity;

  // Animation configurations synchronized using a single 3-second cycle
  const trunkTransition = { duration, repeat, ease: "easeInOut", times: [0, 0.4, 0.8, 1] };
  const branch1Transition = { duration, repeat, ease: "easeInOut", times: [0, 0.15, 0.5, 0.8, 1] };
  const branch2Transition = { duration, repeat, ease: "easeInOut", times: [0, 0.25, 0.6, 0.8, 1] };
  const branch3Transition = { duration, repeat, ease: "easeInOut", times: [0, 0.35, 0.7, 0.8, 1] };

  const leaf1Transition = { duration, repeat, ease: "backOut", times: [0, 0.5, 0.55, 0.8, 1] };
  const leaf2Transition = { duration, repeat, ease: "backOut", times: [0, 0.6, 0.65, 0.8, 1] };
  const leaf3Transition = { duration, repeat, ease: "backOut", times: [0, 0.7, 0.75, 0.8, 1] };

  return (
    <div 
      className="growing-tree-container" 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem"
      }}
    >
      <svg 
        width="160" 
        height="160" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Trunk */}
        <motion.path
          d="M 100 170 L 100 90"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="square"
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={trunkTransition}
        />

        {/* Lower Left Branch */}
        <motion.path
          d="M 100 135 L 75 110"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="square"
          animate={{ pathLength: [0, 0, 1, 1, 0] }}
          transition={branch1Transition}
        />

        {/* Lower Right Branch */}
        <motion.path
          d="M 100 125 L 125 100"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="square"
          animate={{ pathLength: [0, 0, 1, 1, 0] }}
          transition={branch1Transition}
        />

        {/* Upper Left Branch */}
        <motion.path
          d="M 100 110 L 80 90"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="square"
          animate={{ pathLength: [0, 0, 1, 1, 0] }}
          transition={branch2Transition}
        />

        {/* Upper Right Branch */}
        <motion.path
          d="M 100 100 L 120 80"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="square"
          animate={{ pathLength: [0, 0, 1, 1, 0] }}
          transition={branch2Transition}
        />

        {/* Top Branch */}
        <motion.path
          d="M 100 90 L 100 65"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="square"
          animate={{ pathLength: [0, 0, 1, 1, 0] }}
          transition={branch3Transition}
        />

        {/* Leaves (Pixel Art Squares, Rotated by 45 degrees for a brutalist look) */}
        {/* Leaf 1 (Left Lower) */}
        <motion.rect
          x="70"
          y="105"
          width="10"
          height="10"
          fill="#fff"
          style={{ transformOrigin: "75px 110px" }}
          animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0], rotate: 45 }}
          transition={leaf1Transition}
        />

        {/* Leaf 2 (Right Lower) */}
        <motion.rect
          x="120"
          y="95"
          width="10"
          height="10"
          fill="#fff"
          style={{ transformOrigin: "125px 100px" }}
          animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0], rotate: 45 }}
          transition={leaf1Transition}
        />

        {/* Leaf 3 (Left Upper) */}
        <motion.rect
          x="75"
          y="85"
          width="10"
          height="10"
          fill="#fff"
          style={{ transformOrigin: "80px 90px" }}
          animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0], rotate: 45 }}
          transition={leaf2Transition}
        />

        {/* Leaf 4 (Right Upper) */}
        <motion.rect
          x="115"
          y="75"
          width="10"
          height="10"
          fill="#fff"
          style={{ transformOrigin: "120px 80px" }}
          animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0], rotate: 45 }}
          transition={leaf2Transition}
        />

        {/* Leaf 5 (Top) */}
        <motion.rect
          x="95"
          y="60"
          width="10"
          height="10"
          fill="#fff"
          style={{ transformOrigin: "100px 65px" }}
          animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0], rotate: 45 }}
          transition={leaf3Transition}
        />
      </svg>
      <div 
        className="growing-tree-text" 
        style={{
          fontFamily: "monospace",
          fontSize: "1.1rem",
          fontWeight: "bold",
          color: "#fff",
          letterSpacing: "0.25em",
          textTransform: "uppercase"
        }}
      >
        Growing DayTree
      </div>
    </div>
  );
}
