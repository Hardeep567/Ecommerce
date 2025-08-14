import React from "react";
import Sales from "components/sections/LeaderBoard/Product";
import TopProducts from "components/sections/dashboard/top-products/TopProducts";
import { Box } from "@mui/material";

const Leaderboard = () => {
  return (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3.5}>
      <Box gridColumn={{ xs: "span 12", xl: "span 6" }} order={{ xs: 1 }}>
        <Sales />
      </Box>
      <Box gridColumn={{ xs: "span 12", xl: "span 6" }} order={{ xs: 2 }}>
        <TopProducts />
      </Box>
    </Box>
  );
};

export default Leaderboard;
