import React, { useState, useEffect, useRef, useMemo } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import { StyledDashboardWrap } from "../dashboard/style";
import { HyperFormula } from "hyperformula";
import { ExportBtn } from "../export/export";
import "./style.css";
import { useAppSelector } from "../../store/hooks";

import { calculateLetters } from "./utils";
registerAllModules();

export const Table: React.FC = () => {
  const hotRef = useRef(null);
  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: "internal-use-in-handsontable",
  });
  const table = useAppSelector((state) => state.table.data);

  if (!table) {
    return <h1>loading</h1>;
  }

  return (
    <StyledDashboardWrap>
      <HotTable
        ref={hotRef}
        data={[table[1]]}
        colHeaders={table[0]}
        formulas={{
          engine: hyperformulaInstance,
        }}
        rowHeaders={true}
        manualColumnMove={true}
        copyPaste={true}
        height="80%"
        width="100%"
        licenseKey="non-commercial-and-evaluation"
        filters={true}
        // enable the column menu
        dropdownMenu={true}
      />
    </StyledDashboardWrap>
  );
};
