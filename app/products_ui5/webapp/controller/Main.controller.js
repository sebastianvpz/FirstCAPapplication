sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",         // 1. Pedimos el filtro
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("com.seidor.trial.productsui5.controller.Main", {
        onInit() {
        },
        onRefresh: function () {
            const oTable = this.getView().byId("idProductsTable");
            oTable.getBinding("items").refresh();

            MessageToast.show("Lista de productos actualizada");
        },
        onSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilter = [];

            if (sQuery && sQuery.length > 0) {
                const oFilter = new Filter({
                    path: "Name",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false 
                });
                aFilter.push(oFilter);
            }

            // 3. Aplicar a la tabla
            const oTable = this.getView().byId("idProductsTable");
            const oBinding = oTable.getBinding("items");

            oBinding.filter(aFilter);
        }

    });
});