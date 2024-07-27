import { useState } from "react";
import styles from "@/styles/Home.module.scss";
import Header from "@/components/Header";
import Link from "next/link";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";

import { Input, InputGroup, DatePicker, SelectPicker, Stack, Toggle, Button, toaster, Notification } from "rsuite";

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

interface Props {
  listPeople: People[],
  listDocuments: Document[]
}

export default function Home({ listDocuments, listPeople }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
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
    console.log({protocol})
    console.log({initialDate})
    console.log({finalDate})
    console.log({selectedDocument})
    console.log({selectedPeople})
    console.log({partialResponse})
    console.log({ok})

    if(!protocol || !initialDate || !finalDate || !selectedDocument || !selectedPeople) {
      toaster.push(
        <Notification type="warning" header="Aviso!">
          Preencha todos os dados para cadastrar!
        </Notification>, {placement: 'topEnd', duration: 3500}
      )
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
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const documents = await api.get("/documents")

    const people = await api.get("/peoples")

    return {
      props: {
        listDocuments: documents.data,
        listPeople: people.data
      }
    }
  } catch (error) {
    console.log("Erro na consulta a API!")

    return {
      props: {
        listDocuments: [],
        listPeople: []
      }
    }
  }
}
