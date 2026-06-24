import {
 obtenerTodos,
 obtenerPorId,
 crear
} from "../compras.controller";

import * as service from "../compras.service";

jest.mock("../compras.service");

describe("Compras Controller", () => {

let req:any;
let res:any;

beforeEach(()=>{

req={};

res={
json:jest.fn(),

status:jest.fn().mockReturnThis()
};

jest.clearAllMocks();

});

describe("obtenerTodos()",()=>{

it("debe devolver todas las compras",async()=>{

const mockCompras=[

{
id_compra:1,
total:100000
}

];

(service.getAllCompras as jest.Mock)
.mockResolvedValue(mockCompras);

await obtenerTodos(req,res);

expect(service.getAllCompras)
.toHaveBeenCalled();

expect(res.json)
.toHaveBeenCalledWith({

success:true,

data:mockCompras

});

});

it("debe retornar error 500",async()=>{

(service.getAllCompras as jest.Mock)

.mockRejectedValue(

new Error("falló")

);

await obtenerTodos(req,res);

expect(res.status)

.toHaveBeenCalledWith(500);

});

});

describe("obtenerPorId()",()=>{

it("debe devolver compra",async()=>{

req.params={

id:"1"

};

(service.getCompraById as jest.Mock)

.mockResolvedValue({

id_compra:1

});

await obtenerPorId(req,res);

expect(service.getCompraById)

.toHaveBeenCalledWith(1);

});

it("debe devolver 400 si id inválido",async()=>{

req.params={

id:"abc"

};

await obtenerPorId(req,res);

expect(res.status)

.toHaveBeenCalledWith(400);

});

});

describe("crear()",()=>{

it("debe crear compra",async()=>{

req.body={

id_proveedor:1,

detalles:[

{

id_producto:2,

cantidad:2,

costo_unitario:1000

}

]

};

(service.crearCompra as jest.Mock)

.mockResolvedValue({

message:"ok"

});

await crear(req,res);

expect(res.status)

.toHaveBeenCalledWith(201);

});

});

});