import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";
import Header from "@/components/Header";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { CiTrash } from "react-icons/ci";
import { FaPencilAlt } from "react-icons/fa";
import Router from "next/router";
import { Input, InputGroup, DatePicker, SelectPicker, Stack, Toggle, Button, toaster, Notification, Table } from "rsuite";
const { Column, HeaderCell, Cell } = Table;

import { api } from "@/services/apiClient";
import { ProtocolModal, ProtocolProps } from "@/components/ProtocolModal";

interface Option {
  label: string;
  value: string;
}

export interface Document {
  id: string;
  name: string;
}

export interface People {
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
  listPeople: People[];
  listDocuments: Document[];
  rawList: RawListProps[];
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
  const [rawListState, setRowListState] = useState<RawListProps[]>(rawList);
  const [filteredData, setFilteredData] = useState<FormattedList[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [protocolModal, setProtocolModal] = useState<ProtocolProps | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    if (rawListState) {
      const formattedData = rawListState.map((item) => {
        const formattedInitialDate = dayjs(item.initial_date).format("DD/MM/YYYY");
        const formattedFinalDate = dayjs(item.final_date).format("DD/MM/YYYY");
        const formattedPartialResponse = item.partial_answer ? "Sim" : "Não";
        const formattedOk = item.right ? "OK" : "Não OK";
        const documentName = listDocuments.find((doc) => doc.id === item.document_id)?.name || "";
        const peopleName = listPeople.find((person) => person.id === item.people_id)?.name || "";

        return {
          id: item.id,
          name: item.name,
          initial_date: formattedInitialDate,
          final_date: formattedFinalDate,
          document: documentName,
          people: peopleName,
          partial_answer: formattedPartialResponse,
          right: formattedOk,
        };
      });

      setFilteredData(formattedData);
    }
  }, [rawListState, listDocuments, listPeople]);

  useEffect(() => {
    const lowercasedFilter = filterValue.toLowerCase();
    const filtered = rawListState
      .map((item) => {
        const formattedInitialDate = dayjs(item.initial_date).format("DD/MM/YYYY");
        const formattedFinalDate = dayjs(item.final_date).format("DD/MM/YYYY");
        const formattedPartialResponse = item.partial_answer ? "Sim" : "Não";
        const formattedOk = item.right ? "OK" : "Não OK";
        const documentName = listDocuments.find((doc) => doc.id === item.document_id)?.name || "";
        const peopleName = listPeople.find((person) => person.id === item.people_id)?.name || "";

        return {
          id: item.id,
          name: item.name,
          initial_date: formattedInitialDate,
          final_date: formattedFinalDate,
          document: documentName,
          people: peopleName,
          partial_answer: formattedPartialResponse,
          right: formattedOk,
        };
      })
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(lowercasedFilter) ||
          item.initial_date.toLowerCase().includes(lowercasedFilter) ||
          item.final_date.toLowerCase().includes(lowercasedFilter) ||
          item.document.toLowerCase().includes(lowercasedFilter) ||
          item.people.toLowerCase().includes(lowercasedFilter) ||
          item.partial_answer.toLowerCase().includes(lowercasedFilter) ||
          item.right.toLowerCase().includes(lowercasedFilter)
        );
      });

    setFilteredData(filtered);
  }, [filterValue, rawListState, listDocuments, listPeople]);

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

  async function updateRawList() {
    try {
      const updatedList = await api.get<RawListProps[]>("/protocols");

      setRowListState(updatedList.data);
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Erro!">
          Erro ao buscar protocolos!
        </Notification>,
        { placement: "topEnd", duration: 3500 }
      );
    }
  }

  function handleClose() {
    setModalVisible(false)
  }

  async function handleRegisterProtocol() {
    setLoading(true);

    if (!protocol || !initialDate || !finalDate || !selectedDocument || !selectedPeople) {
      setLoading(false);

      toaster.push(
        <Notification type="warning" header="Aviso!">
          Preencha todos os dados para cadastrar!
        </Notification>,
        { placement: "topEnd", duration: 3500 }
      );

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
        document_id: selectedDocument,
      });

      toaster.push(
        <Notification type="success" header="Sucesso!">
          Protocolo cadastrado com sucesso!
        </Notification>,
        { placement: "topEnd", duration: 3500 }
      );

      setProtocol("");
      setInitialDate(null);
      setFinalDate(null);
      setSelectedDocument(null);
      setSelectedPeople(null);
      setPartialResponse(false);
      setOk(false);
      setLoading(false);

      updateRawList();
    } catch (error) {
      setLoading(false);

      toaster.push(
        <Notification type="error" header="Erro!">
          Este protocolo já está cadastrado!
        </Notification>,
        { placement: "topEnd", duration: 3500 }
      );

      console.log("Erro ao cadastrar protocolo :::::>> ", error);
    }
  }

  async function handleCalculateFinalDate(initialDate: Date | null) {
    if (initialDate) {
      const date = dayjs(initialDate);
      const finalDate = date.add(100, "day").toDate();
      setFinalDate(finalDate);
    }
  }

  async function handleDeleteProtocol(id: string) {
    try {
      const response = await api.delete("/protocol/" + id);

      toaster.push(
        <Notification type="success" header="Sucesso!">
          Protocolo excluido com sucesso!
        </Notification>,
        { placement: "topEnd", duration: 3500 }
      );

      updateRawList();
    } catch (error) {
      console.log(error);
      toaster.push(
        <Notification type="error" header="Erro!">
          Erro ao excluir protocolo!
        </Notification>,
        { placement: "topEnd", duration: 3500 }
      );
    }
  }

  const documentOptions = listDocuments.map((doc) => ({ label: doc.name, value: doc.id }));
  const peopleOptions = listPeople.map((person) => ({ label: person.name, value: person.id }));

  return (
    <>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <Stack spacing={10} direction="row">
            <InputGroup style={stylesProtocolInput}>
              <Input placeholder="N° do Protocolo" value={protocol} onChange={(value: string) => setProtocol(value)} />
            </InputGroup>
            <DatePicker
              format="dd/MM/yyyy"
              placeholder="Data Inicial"
              value={initialDate}
              onChange={(date: Date | null) => {
                setInitialDate(date);
                handleCalculateFinalDate(date);
              }}
            />
            <DatePicker format="dd/MM/yyyy" disabled placeholder="Data Final" value={finalDate} />
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
            <Toggle checked={partialResponse} onChange={(checked: boolean) => setPartialResponse(checked)}>
              Resp. Parcial
            </Toggle>
            <Toggle checked={ok} onChange={(checked: boolean) => setOk(checked)}>
              Tudo OK
            </Toggle>
          </Stack>
          <div className={styles.containerButton}>
            <Button loading={loading} color="green" appearance="primary" onClick={handleRegisterProtocol}>
              Cadastrar
            </Button>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Filtrar tabela"
              value={filterValue}
              onChange={(value: string) => setFilterValue(value)}
            />
          </div>
          <Table height={450} data={filteredData}>
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
              <HeaderCell>Resposta Parcial</HeaderCell>
              <Cell dataKey="partial_answer" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell>OK</HeaderCell>
              <Cell dataKey="right" />
            </Column>
            <Column width={75} fixed="right">
              <HeaderCell>Ações</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <CiTrash className={styles.iconHover} onClick={() => handleDeleteProtocol(rowData.id)} />
                    <FaPencilAlt
                      className={styles.iconHover}
                      onClick={() => {
                        setModalVisible(true);
                        const selectedProtocol = rawListState.find((item) => item.id === rowData.id);
                        if (selectedProtocol) {
                          setProtocolModal(selectedProtocol);
                        }
                      }}
                    />
                  </div>
                )}
              </Cell>
            </Column>
          </Table>
        </div>
      </div>
      {modalVisible && (
        <ProtocolModal
          open={modalVisible}
          handleClose={handleClose}
          protocol={protocolModal}
          peopleList={listPeople}
          documentList={listDocuments}
          updateRawList={updateRawList}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const documents = await api.get("/documents");
    const people = await api.get("/peoples");
    const rawList = await api.get("/protocols");

    return {
      props: {
        listDocuments: documents.data,
        listPeople: people.data,
        rawList: rawList.data,
      },
    };
  } catch (error) {
    console.log("Erro na consulta a API!");

    return {
      props: {
        listDocuments: [],
        listPeople: [],
        rawList: [],
      },
    };
  }
};
