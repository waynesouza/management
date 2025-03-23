package com.example.demo.application.dto;

import java.math.BigDecimal;

public class ItemDTO {

    private String nome;
    private BigDecimal valor;
    private String tipo;

    public ItemDTO() { }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

}
