sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("com.seidor.trial.productsui5.controller.Main", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteMain").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function () {
            const oTable = this.getView().byId("idProductsTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.refresh();
            }
        },

        onRefresh: function () {
            this._onObjectMatched();
            MessageToast.show("Lista de productos actualizada");
        },

        onSearch: function (oEvent) {
            // 1. Obtenemos el valor del buscador
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // 2. Creamos el filtro usando el objeto de configuración
                // Usamos solo "Name" porque es el campo de texto seguro
                const oFilterName = new Filter({
                    path: "Name",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false // <--- Esto ignora mayúsculas/minúsculas
                });

                aFilters.push(oFilterName);
            }

            // 3. Aplicamos el filtro a la tabla
            const oTable = this.getView().byId("idProductsTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(aFilters);
            }
        },

        onNavCreate: function () {
            this.getOwnerComponent().getRouter().navTo("RouteCreate");
        },

        onProductPress: function (oEvent) {
            const sProductID = oEvent.getSource().getBindingContext().getProperty("ID");
            this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                productID: sProductID
            });
        },

        onDeleteProduct: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sProductName = oContext.getProperty("Name");

            MessageBox.confirm(`¿Eliminar "${sProductName}"?`, {
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        oContext.delete().then(() => {
                            MessageToast.show("Producto eliminado");
                        }).catch((oError) => {
                            MessageBox.error("Error: " + oError.message);
                        });
                    }
                }
            });
        }
    });
});