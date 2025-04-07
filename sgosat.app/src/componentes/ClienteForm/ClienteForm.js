import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PessoaAPI from '../api/PessoaAPI'; // ajuste o caminho conforme seu projeto

const ClienteForm = () => {
  const [modoAtualizacao, setModoAtualizacao] = useState(false);
  const [formDesabilitado, setFormDesabilitado] = useState(true);
  const [idCliente, setIdCliente] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const schema = Yup.object().shape({
    documento: Yup.string().required('Documento é obrigatório'),
    nome: Yup.string().required('Nome é obrigatório'),
    tipoPessoa: Yup.string().required('Tipo de pessoa é obrigatório'),
    telefone: Yup.string(),
    email: Yup.string().email('E-mail inválido'),
    cep: Yup.string(),
    logradouro: Yup.string(),
    numero: Yup.string(),
    complemento: Yup.string(),
    bairro: Yup.string(),
    cidade: Yup.string(),
    uf: Yup.string(),
    cliente: Yup.boolean(),
    funcionario: Yup.boolean()
  });

  const buscarClientePorDocumento = async (documento, setValues) => {
    if (!documento || documento.length < 5) return;

    setCarregando(true);

    try {
      const cliente = await PessoaAPI.obterPorDocAsync(documento);

      if (cliente) {
        setValues(cliente); // preencher formulário com dados
        setModoAtualizacao(true);
        setFormDesabilitado(false);
        setIdCliente(cliente.id);
      } else {
        setModoAtualizacao(false);
        setFormDesabilitado(false);
        setIdCliente(null);
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (modoAtualizacao) {
        await PessoaAPI.atualizarAsync(idCliente, ...Object.values(values));
        alert('Cliente atualizado com sucesso!');
      } else {
        await PessoaAPI.criarAsync(...Object.values(values));
        alert('Cliente cadastrado com sucesso!');
      }

      resetForm();
      setModoAtualizacao(false);
      setFormDesabilitado(true);
      setIdCliente(null);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Veja o console para detalhes.');
    }
  };

  return (
    <Formik
      validationSchema={schema}
      initialValues={{
        nome: '',
        tipoPessoa: '',
        documento: '',
        telefone: '',
        email: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        cliente: true,
        funcionario: false,
      }}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, touched, errors, setValues }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="documento">
              <Form.Label>Documento</Form.Label>
              <Form.Control
                type="text"
                name="documento"
                value={values.documento}
                onChange={handleChange}
                onBlur={(e) => {
                  handleBlur(e);
                  buscarClientePorDocumento(e.target.value, setValues);
                }}
                isInvalid={touched.documento && !!errors.documento}
                disabled={modoAtualizacao}
              />
              <Form.Control.Feedback type="invalid">
                {errors.documento}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          {carregando && <Spinner animation="border" />}

          {!formDesabilitado && (
            <>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={values.nome}
                    onChange={handleChange}
                    isInvalid={touched.nome && !!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="tipoPessoa">
                  <Form.Label>Tipo Pessoa</Form.Label>
                  <Form.Control
                    as="select"
                    name="tipoPessoa"
                    value={values.tipoPessoa}
                    onChange={handleChange}
                    isInvalid={touched.tipoPessoa && !!errors.tipoPessoa}
                  >
                    <option value="">Selecione...</option>
                    <option value="Física">Física</option>
                    <option value="Jurídica">Jurídica</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.tipoPessoa}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="telefone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={values.telefone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md="8" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="cep">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    name="cep"
                    value={values.cep}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="logradouro">
                  <Form.Label>Logradouro</Form.Label>
                  <Form.Control
                    type="text"
                    name="logradouro"
                    value={values.logradouro}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md="3" controlId="numero">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero"
                    value={values.numero}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="complemento">
                  <Form.Label>Complemento</Form.Label>
                  <Form.Control
                    type="text"
                    name="complemento"
                    value={values.complemento}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="bairro">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    type="text"
                    name="bairro"
                    value={values.bairro}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md="3" controlId="cidade">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="cidade"
                    value={values.cidade}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md="1" controlId="uf">
                  <Form.Label>UF</Form.Label>
                  <Form.Control
                    type="text"
                    name="uf"
                    value={values.uf}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="cliente"
                  label="É Cliente"
                  name="cliente"
                  checked={values.cliente}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  id="funcionario"
                  label="É Funcionário"
                  name="funcionario"
                  checked={values.funcionario}
                  onChange={handleChange}
                />
              </Row>

              <Button variant="primary" type="submit">
                {modoAtualizacao ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
              </Button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ClienteForm;
