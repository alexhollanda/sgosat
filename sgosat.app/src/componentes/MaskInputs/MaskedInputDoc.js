import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { Form, Col } from 'react-bootstrap';

function MaskedInputDoc({ label, value, onChange }) {
  const [mask, setMask] = useState('999.999.999-99'); // Máscara padrão para CPF

  // Troca a máscara com base no tamanho da string (CPF ou CNPJ)
  const handleMaskChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    if (inputValue.length > 11) {
      setMask('99.999.999/9999-99'); // Máscara para CNPJ
    } else {
      setMask('999.999.999-99'); // Máscara para CPF
    }
    onChange(e);
  };

  return (
    <Form.Group as={Col} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputMask
        mask={mask}
        value={value}
        onChange={handleMaskChange}
        className="form-control"
        placeholder={mask === '999.999.999-99' ? 'CPF' : 'CNPJ'}
      />
    </Form.Group>
  );
}

export default MaskedInputDoc;