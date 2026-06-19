"use client";

import { createElement } from "react";

type PromptBoxProps = {
  prompt: string;
  onNewPrompt: () => void;
  disabled?: boolean;
};

export function PromptBox({ prompt, onNewPrompt, disabled }: PromptBoxProps) {
  return createElement(
    "section",
    {
      className: "rounded-lg border border-ink/10 bg-white/85 p-6 shadow-panel backdrop-blur",
    },
    createElement(
      "div",
      {
        className:
          "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
      },
      createElement(
        "h2",
        { className: "text-sm font-semibold uppercase tracking-wide text-sea" },
        "Speaking prompt"
      ),
      createElement(
        "button",
        {
          className:
            "rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-sea hover:text-sea disabled:cursor-not-allowed disabled:opacity-50",
          disabled,
          onClick: onNewPrompt,
          type: "button",
        },
        "New prompt"
      )
    ),
    createElement(
      "p",
      {
        className: "text-2xl font-semibold leading-snug text-ink md:text-3xl",
      },
      prompt
    )
  );
}