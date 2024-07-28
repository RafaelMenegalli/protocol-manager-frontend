import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";
import Header from "@/components/Header";
import Link from "next/link";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";

import Router from "next/router";

import { Input, InputGroup, DatePicker, SelectPicker, Stack, Toggle, Button, toaster, Notification, Table, Col } from "rsuite";
const { Column, HeaderCell, Cell } = Table;

import { api } from "@/services/apiClient";

interface Option {
  label: string;
  value: string;
}

interface Document {
  id: string;
  name: string;
}

interface People {
  id: string;
  name: string;
}

interface RawListProps {
  id: string;
  name: string;
  initial_date: string;
  final_date: string;
  partial_answer: boolean;
  right: boolean;
  createdAt: string;
  updatedAt: string;
  people_id: string;
  document_id: string;
}

interface Props {
  listPeople: People[],
  listDocuments: Document[],
  rawList: RawListProps[]
}

interface FormattedList {
  id: string;
  name: string;
  initial_date: string;
  final_date: string;
  document: string;
  people: string;
  partial_answer: string;
  right: string;
}

export default function Home({ listDocuments, listPeople, rawList }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const [rawListState, setRowListState] = useState<RawListProps[]>(rawList)
  const [filteratedData, setFilteratedData] = useState<FormattedList[]>([]);

  useEffect(() => {
    if (rawListState) {
      const formattedData = rawListState.map((item) => {
        const formattedInitialDate = dayjs(item.initial_date).format("DD/MM/YYYY");
        const formattedFinalDate = dayjs(item.final_date).format("DD/MM/YYYY");

        const formattedPartialResponse = item.partial_answer ? "Sim" : "Não";
        const formattedOk = item.right ? "OK" : "Não OK";

        const documentName = listDocuments.find((doc) => doc.id === item.document_id)?.name || "";
        const peopleName = listPeople.find((person) => person.id === item.people_id)?.name || "";

        console.log({documentName})
        console.log({peopleName})

        return {
          id: item.id,
          name: item.name,
          initial_date: formattedInitialDate,
          final_date: formattedFinalDate,
          document: documentName,
          people: peopleName,
          partial_answer: formattedPartialResponse,
          right: formattedOk
        };

      });

      setFilteratedData(formattedData);
    }

  }, [rawListState, listDocuments, listPeople])

  const [protocol, setProtocol] = useState<string>("");
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<string | null>(null);
  const [partialResponse, setPartialResponse] = useState<boolean>(false);
  const [ok, setOk] = useState<boolean>(false);

  const stylesProtocolInput = {
    width: 250,
  };

  async function handleRegisterProtocol() {
    setLoading(true)

    if (!protocol || !initialDate || !finalDate || !selectedDocument || !selectedPeople) {
      setLoading(false)

      toaster.push(
        <Notification type="warning" header="Aviso!">
          Preencha todos os dados para cadastrar!
        </Notification>, { placement: 'topEnd', duration: 3500 }
      )

      return;
    }

    try {
      const response = await api.post("/protocol", {
        name: protocol,
        initial_date: initialDate,
        final_date: finalDate,
        partial_answer: partialResponse,
        right: ok,
        people_id: selectedPeople,
        document_id: selectedDocument
      })

      
      toaster.push(
        <Notification type="success" header="Sucesso!">
          Protocolo cadastrado com sucesso!
        </Notification>, { placement: 'topEnd', duration: 1500 }
      )
      
      setProtocol("")
      setInitialDate(null)
      setFinalDate(null)
      setSelectedDocument(null)
      setSelectedPeople(null)
      setPartialResponse(false)
      setOk(false)
      
      setLoading(false)
      
      setTimeout(() => {
        Router.reload()
      }, 2000)
      
    } catch (error) {
      setLoading(false)

      toaster.push(
        <Notification type="error" header="Erro!">
          Este protocolo já está cadastrado!
        </Notification>, {placement: 'topEnd', duration: 3500}
      )

      console.log("Erro ao cadastrar protocolo :::::>> ", error)
    }
  }

  async function handleCalculateFinalDate(initialDate: Date | null) {
    if (initialDate) {
      const date = dayjs(initialDate)
      const finalDate = date.add(100, 'day').toDate()

      setFinalDate(finalDate)
    }
  }

  const documentOptions = listDocuments.map(doc => ({ label: doc.name, value: doc.id }))
  const peopleOptions = listPeople.map(person => ({ label: person.name, value: person.id }))

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
              format="dd/MM/yyyy"
              placeholder="Data Inicial"
              value={initialDate}
              onChange={(date: Date | null) => {
                setInitialDate(date)
                handleCalculateFinalDate(date)
              }}
            />

            <DatePicker
              format="dd/MM/yyyy"
              disabled
              placeholder="Data Final"
              value={finalDate}
            />

            <SelectPicker
              data={documentOptions}
              style={{ width: 224 }}
              placeholder="Documentos"
              value={selectedDocument}
              onChange={(value: string | null) => setSelectedDocument(value)}
            />

            <SelectPicker
              data={peopleOptions}
              style={{ width: 224 }}
              placeholder="Resp. Pessoa"
              value={selectedPeople}
              onChange={(value: string | null) => setSelectedPeople(value)}
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
          <Table
            height={450}
            data={filteratedData}
          >
            <Column flexGrow={1}>
              <HeaderCell>Protocolo</HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>Data Inícial</HeaderCell>
              <Cell dataKey="initial_date" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>Data Final</HeaderCell>
              <Cell dataKey="final_date" />
            </Column>

            <Column flexGrow={1} resizable>
              <HeaderCell>Documento</HeaderCell>
              <Cell dataKey="document" />
            </Column>

            <Column flexGrow={1} resizable>
              <HeaderCell>Pessoa</HeaderCell>
              <Cell dataKey="people" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>Resposta Parcal</HeaderCell>
              <Cell dataKey="partial_answer" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>OK</HeaderCell>
              <Cell dataKey="right" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>Ações</HeaderCell>
              <Cell> Ação! </Cell>
            </Column>
          </Table>
        </div>

      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const documents = await api.get("/documents")

    const people = await api.get("/peoples")

    const rawList = await api.get("/protocols")

    return {
      props: {
        listDocuments: documents.data,
        listPeople: people.data,
        rawList: rawList.data
      }
    }
  } catch (error) {
    console.log("Erro na consulta a API!")

    return {
      props: {
        listDocuments: [],
        listPeople: [],
        rawList: []
      }
    }
  }
}
