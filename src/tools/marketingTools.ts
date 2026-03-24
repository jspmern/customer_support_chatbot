import { tool } from "@langchain/core/tools"
export const getOffer = tool(() => {
     return JSON.stringify([
            {
                code: 'LAUNCH',
                discount_percent: 30,
            },
            {
                code: 'FIRST_20',
                discount_percent: 20,
            },
        ]);
}, {
  name: "get_offer",
  description: "Call to get available offers.",
});
