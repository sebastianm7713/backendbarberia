"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const compras_controller_1 = require("../compras.controller");
const service = __importStar(require("../compras.service"));
jest.mock("../compras.service");
describe("Compras Controller", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });
    describe("obtenerTodos()", () => {
        it("debe devolver todas las compras", async () => {
            const mockCompras = [
                {
                    id_compra: 1,
                    total: 100000
                }
            ];
            service.getAllCompras
                .mockResolvedValue(mockCompras);
            await (0, compras_controller_1.obtenerTodos)(req, res);
            expect(service.getAllCompras)
                .toHaveBeenCalled();
            expect(res.json)
                .toHaveBeenCalledWith({
                success: true,
                data: mockCompras
            });
        });
        it("debe retornar error 500", async () => {
            service.getAllCompras
                .mockRejectedValue(new Error("falló"));
            await (0, compras_controller_1.obtenerTodos)(req, res);
            expect(res.status)
                .toHaveBeenCalledWith(500);
        });
    });
    describe("obtenerPorId()", () => {
        it("debe devolver compra", async () => {
            req.params = {
                id: "1"
            };
            service.getCompraById
                .mockResolvedValue({
                id_compra: 1
            });
            await (0, compras_controller_1.obtenerPorId)(req, res);
            expect(service.getCompraById)
                .toHaveBeenCalledWith(1);
        });
        it("debe devolver 400 si id inválido", async () => {
            req.params = {
                id: "abc"
            };
            await (0, compras_controller_1.obtenerPorId)(req, res);
            expect(res.status)
                .toHaveBeenCalledWith(400);
        });
    });
    describe("crear()", () => {
        it("debe crear compra", async () => {
            req.body = {
                id_proveedor: 1,
                detalles: [
                    {
                        id_producto: 2,
                        cantidad: 2,
                        costo_unitario: 1000
                    }
                ]
            };
            service.crearCompra
                .mockResolvedValue({
                message: "ok"
            });
            await (0, compras_controller_1.crear)(req, res);
            expect(res.status)
                .toHaveBeenCalledWith(201);
        });
    });
});
