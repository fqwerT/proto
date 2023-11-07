import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { StyledDashboardWrap } from "../dashboard/style";
import * as S from "./style";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import { HyperFormula } from "hyperformula";
import { SelectInput } from "../selectinput/Selectinput";
import { changeCell, createCell, adapterData } from "./utils";
import { calculateLetters } from "../table/utils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setName, setTable } from "../../store/table/table";
import { useDispatch } from "react-redux";
registerAllModules();

export const CreateTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tableName,setTableName] = useState<string>('')
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleCellClick = useCallback((id: string) => {
    setSelected(id);
  }, []);

  const changeCellValue = useCallback(
    (
      id: string | number,
      title: string | null,
      content: string | number | null,
      isOpen: boolean = false
    ) => {
      changeCell(id, title, content, isOpen, setData);
    },
    [data]
  );

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: "internal-use-in-handsontable",
  });

  //@ts-ignore
  const newStroke = useMemo(() => {
    let stroke = [];
    for (let i = 0; i < data.length; i++) {
      stroke[i] = data[i].newStroke;
    }
    return stroke;
  }, [data]);

  //@ts-ignore
  const dataMemo = useMemo(() => {
    return adapterData(data, newStroke);
  }, [data, newStroke]);

  const hotRef = useRef(null);

  const saveData = () => {
    dispatch(setTable(dataMemo));
    navigate("/table");
  };

  const deleteCell = (id: string | number) => {
    setData(data.filter((i) => i.id !== id));
  };
  const handleTableName = (value:string) => {
        setTableName(value)
  }

  useEffect(()=>{
   if (tableName !== '') {
     dispatch(setName(tableName))
   }
  },[tableName])

  return (
    <StyledDashboardWrap>
      <S.StyledCreateTableHeader>
        <S.StyledButton onClick={() => createCell(setData, setSelected)}>
          Добавить столбец
        </S.StyledButton>
        <S.StyledInput placeholder="Название таблицы" onChange={(e) => handleTableName(e.target.value)}/>
      </S.StyledCreateTableHeader>
      <S.StyledCellsList id="cellswrap">
        {data.map((item, index) => (
          <SelectInput
            key={index}
            changeCellValue={changeCellValue}
            handleCellClick={handleCellClick}
            item={item}
            deleteCell={deleteCell}
          />
        ))}
      </S.StyledCellsList>
      <S.StyledTableDemo>
        {data.length !== 0 && (
          <>
            <h1>Предпросмотр</h1>
            <HotTable
              ref={hotRef}
              data={dataMemo}
              //@ts-ignore
              colHeaders={true}
              rowHeaders={true}
              copyPaste={true}
              height="100%"
              width="100%"
              licenseKey="non-commercial-and-evaluation"
              formulas={{
                engine: hyperformulaInstance,
              }}
            />
          </>
        )}
      </S.StyledTableDemo>
      <S.StyledButton onClick={() => saveData()}>
        Перейти к полному редактирвоанию
      </S.StyledButton>
    </StyledDashboardWrap>
  );
};
