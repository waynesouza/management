package com.example.demo.application.dto;

import java.util.List;

public class DataDTO {

    private Integer serviceId;
    private String customerName;
    private String workshop;
    private String car;
    private String licensePlate;
    private List<ItemDTO> parts;
    private List<ItemDTO> services;
    private String subTotalParts;
    private String subTotalServices;
    private String total;

    public DataDTO() { }

    public DataDTO(Integer serviceId, List<ItemDTO> parts, List<ItemDTO> services, String subTotalParts, String subTotalServices, String total) {
        this.serviceId = serviceId;
        this.parts = parts;
        this.services = services;
        this.subTotalParts = subTotalParts;
        this.subTotalServices = subTotalServices;
        this.total = total;
    }

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getWorkshop() {
        return workshop;
    }

    public void setWorkshop(String workshop) {
        this.workshop = workshop;
    }

    public String getCar() {
        return car;
    }

    public void setCar(String car) {
        this.car = car;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public List<ItemDTO> getParts() {
        return parts;
    }

    public void setParts(List<ItemDTO> parts) {
        this.parts = parts;
    }

    public List<ItemDTO> getServices() {
        return services;
    }

    public void setServices(List<ItemDTO> services) {
        this.services = services;
    }

    public String getSubTotalParts() {
        return subTotalParts;
    }

    public void setSubTotalParts(String subTotalParts) {
        this.subTotalParts = subTotalParts;
    }

    public String getSubTotalServices() {
        return subTotalServices;
    }

    public void setSubTotalServices(String subTotalServices) {
        this.subTotalServices = subTotalServices;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

}
