import { useState } from "react";
import styles from "@/styles/Home.module.scss";
import Header from "@/components/Header";
import Link from "next/link";
import {
  Input,
  InputGroup,
  DatePicker,
  SelectPicker,
  Stack,
  Toggle,
  Button,
} from "rsuite";

interface Option {
  label: string;
  value: string;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [protocol, setProtocol] = useState<string>("");
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [document, setDocument] = useState<string | null>(null);
  const [people, setPeople] = useState<string | null>(null);
  const [partialResponse, setPartialResponse] = useState<boolean>(false);
  const [ok, setOk] = useState<boolean>(false);

  const stylesProtocolInput = {
    width: 250,
  };

  const exampleData: Option[] = ["Teste 1", "Teste 2", "Teste 3"].map(
    (item) => ({ label: item, value: item })
  );

  async function handleRegisterProtocol() {
    console.log({ protocol })
    console.log({ initialDate })
    console.log({ finalDate })
    console.log({ document })
    console.log({ people })
    console.log({ partialResponse })
    console.log({ ok })
  }

  return (
    <>
      <Header />

      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <Stack spacing={10} direction="row">
            <InputGroup style={stylesProtocolInput}>
              <Input
                placeholder="N° do Protocolo"
                value={protocol}
                onChange={(value: string) => setProtocol(value)}
              />
            </InputGroup>

            <DatePicker
              format="MM/dd/yyyy"
              placeholder="Data Inicial"
              value={initialDate}
              onChange={(date: Date | null) => setInitialDate(date)}
            />

            <DatePicker
              format="MM/dd/yyyy"
              disabled
              placeholder="Data Final"
              value={finalDate}
              onChange={(date: Date | null) => setFinalDate(date)}
            />

            <SelectPicker
              data={exampleData}
              style={{ width: 224 }}
              placeholder="Documentos"
              value={document}
              onChange={(value: string | null) => setDocument(value)}
            />

            <SelectPicker
              data={exampleData}
              style={{ width: 224 }}
              placeholder="Resp. Pessoa"
              value={people}
              onChange={(value: string | null) => setPeople(value)}
            />

            <Toggle
              checked={partialResponse}
              onChange={(checked: boolean) => setPartialResponse(checked)}
            >
              Resp. Parcial
            </Toggle>

            <Toggle
              checked={ok}
              onChange={(checked: boolean) => setOk(checked)}
            >
              Tudo OK
            </Toggle>
          </Stack>

          <div className={styles.containerButton}>
            <Button
              loading={loading}
              color="green"
              appearance="primary"
              onClick={handleRegisterProtocol}
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
