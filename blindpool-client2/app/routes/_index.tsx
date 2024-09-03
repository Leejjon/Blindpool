import { Button } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  return (
    <div>
     No fucking tailwind.
     <Button variant="outlined">Hoi</Button>
    </div>
  );
}
