sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, History, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.seidor.trial.productsui5.controller.Detail", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();

            const oViewModel = new sap.ui.model.json.JSONModel({
                isCreate: false
            });
            this.getView().setModel(oViewModel, "view");

            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
            oRouter.getRoute("RouteCreate").attachPatternMatched(this._onObjectCreateMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sProductID = oEvent.getParameter("arguments").productID;
            this.getView().getModel("view").setProperty("/isCreate", false);

            this.getView().bindElement({
                path: "/Products(ID=" + sProductID + ")"
            });
        },

        _onObjectCreateMatched: function () {
            const oModel = this.getView().getModel();
            this.getView().getModel("view").setProperty("/isCreate", true);

            this.getView().unbindElement();
            const oListBinding = oModel.bindList("/Products");
            const oContext = oListBinding.create({
                Name: "",
                Price: 0,
                Quantity: 0
            });
            this.getView().setBindingContext(oContext);
        },

        onSave: function () {
            const oModel = this.getView().getModel();
            this.getView().setBusy(true);

            oModel.submitBatch("$auto").then(() => {
                this.getView().setBusy(false);
                sap.m.MessageToast.show("¡Guardado correctamente!");
                this.onNavBack();
            }).catch((oError) => {
                this.getView().setBusy(false);
                sap.m.MessageBox.error("Error: " + oError.message);
            });
        },
        onCancel: function () {
            const oContext = this.getView().getBindingContext();
            const bIsCreate = this.getView().getModel("view").getProperty("/isCreate");

            if (bIsCreate && oContext) {
                oContext.delete("$auto");
            }

            this.onNavBack();
        },

        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteMain", {}, true);
            }
        }
    });
});