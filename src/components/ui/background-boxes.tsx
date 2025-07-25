"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  
  // Nova Search color scheme - blue, purple, cyan
  const colors = [
    "rgb(59 130 246)", // blue-500
    "rgb(139 92 246)", // purple-500
    "rgb(6 182 212)",  // cyan-500
    "rgb(99 102 241)", // indigo-500
    "rgb(168 85 247)", // purple-600
    "rgb(14 165 233)", // sky-500
    "rgb(8 145 178)",  // cyan-600
    "rgb(67 56 202)",  // indigo-600
    "rgb(147 51 234)", // purple-700
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <motion.div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      animate={{
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-600/60 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                scale: 1.1,
                zIndex: 20,
                transition: { duration: 0.3 },
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-slate-600/60 relative cursor-pointer hover:z-10"
              style={{ zIndex: 1 }}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-500/70 stroke-[1px] pointer-events-none"
                  whileHover={{
                    scale: 1.2,
                    color: "rgb(59 130 246)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </motion.svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const Boxes = React.memo(BoxesCore);