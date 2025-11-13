"use client";

import { useState } from "react";
import {
  ping,
  getCart,
  addItemToCart,
  tokenizeCard,
  checkoutCart,
  Cart,
  OrderResponse,
} from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function FarmatodoSimulator() {
  const [customerId] = useState(1); // demo fijo
  const [deliveryAddress, setDeliveryAddress] = useState("CCS");

  const [cart, setCart] = useState<Cart | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pushLog = (msg: string) =>
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} · ${msg}`]);

  const handleRunDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCart(null);
    setOrder(null);
    setLogs([]);

    try {
      // 0) Sanity check opcional con /ping
      pushLog("0) Probando conectividad con /ping...");
      const pong = await ping();
      pushLog(`   /ping → ${pong}`);

      // 1) Ver/crear carrito
      pushLog("1) Obteniendo carrito del cliente 1...");
      let currentCart = await getCart(customerId);
      setCart(currentCart);
      pushLog(
        `   Carrito ${currentCart.cartId} con ${currentCart.items.length} items.`
      );

      // 2) Agregar Aspirina id=1, qty=2
      pushLog("2) Agregando Aspirina 500mg (id=1, qty=2)...");
      currentCart = await addItemToCart({
        customerId,
        productId: 1,
        quantity: 2,
      });
      setCart(currentCart);
      pushLog(
        `   Carrito ahora tiene ${currentCart.items.length} items (incluye Aspirina).`
      );

      // 3) Agregar Alcohol 70% id=3, qty=1
      pushLog("3) Agregando Alcohol 70% (id=3, qty=1)...");
      currentCart = await addItemToCart({
        customerId,
        productId: 3,
        quantity: 1,
      });
      setCart(currentCart);
      pushLog(
        `   Carrito ahora tiene ${currentCart.items.length} items (Aspirina + Alcohol).`
      );

      // 4) Ver carrito (ya lo tenemos en currentCart)
      pushLog("4) Carrito final listo para checkout.");

      // 5) Tokenizar tarjeta
      pushLog("5) Tokenizando tarjeta de prueba (4111...)...");
      const tokenResponse = await tokenizeCard({
        customerId,
        cardNumber: "4111111111111111",
        cvv: "123",
        expDate: "12/27",
      });
      pushLog(`   Token obtenido: ${tokenResponse.token.slice(0, 10)}...`);

      // 6) Checkout
      pushLog("6) Ejecutando checkout del carrito...");
      const orderResponse = await checkoutCart({
        customerId,
        deliveryAddress,
        cardToken: tokenResponse.token,
      });
      setOrder(orderResponse);
      pushLog(
        `   Order ${orderResponse.orderId} → status=${orderResponse.status}, total=${orderResponse.total}.`
      );
      pushLog(
        `   Intentos de pago: ${orderResponse.attempts
          .map(
            (a) => `#${a.attemptNumber} ${a.approved ? "APPROVED" : "REJECTED"}`
          )
          .join(", ")}`
      );
    } catch (err: unknown) {
      console.error(err);

      const message = err instanceof Error ? err.message : "Error desconocido";

      setError(message);
      pushLog(`❌ Ocurrió un error. Revisa detalles arriba. (${message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950/70 via-slate-900/85 to-slate-950/95 p-8 shadow-[0_0_40px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        <div className="mb-6 flex flex-col gap-2">
          <span className="inline-flex items-center self-start rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-700/70">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Demo end-to-end · Cart + Tokens + Checkout
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Flujo completo de compra Farmatodo
          </h2>
          <p className="text-sm text-slate-300">
            Este simulador ejecuta exactamente el flujo que probaste con{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-100">
              curl
            </code>
            : crea/ver carrito, agrega productos, tokeniza la tarjeta y realiza
            el checkout contra el backend en Cloud Run.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRunDemo}>
          <div className="grid gap-4 sm:grid-cols-[1fr,2fr]">
            <div className="space-y-2">
              <Label>Customer ID (demo)</Label>
              <Input value={customerId} disabled />
              <p className="text-[11px] text-slate-400">
                Usamos el cliente <strong>#1</strong>, igual que en tus pruebas
                con curl.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Dirección de entrega</Label>
              <Input
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <p className="text-[11px] text-slate-400">
                Se envía en el campo{" "}
                <code className="rounded bg-slate-800 px-1 py-0.5 text-[10px]">
                  deliveryAddress
                </code>{" "}
                del request de checkout.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-xs text-slate-300">
            <p className="mb-1 font-semibold text-slate-100">
              Escenario de prueba:
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Producto 1: Aspirina 500mg (id=1, cantidad=2)</li>
              <li>Producto 2: Alcohol 70% (id=3, cantidad=1)</li>
              <li>Tarjeta de prueba: 4111 1111 1111 1111 · CVV 123 · 12/27</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full justify-center"
          >
            {loading
              ? "Ejecutando flujo..."
              : "Ejecutar flujo completo de demo"}
          </Button>
        </form>

        {/* Resultado visual del carrito y la orden */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
            <h3 className="text-sm font-semibold text-slate-100">Carrito</h3>
            {!cart && (
              <p className="text-xs text-slate-400">
                Ejecuta el flujo para ver el contenido del carrito.
              </p>
            )}
            {cart && (
              <div className="space-y-2 text-xs text-slate-200">
                <p>
                  <span className="font-medium">ID:</span> {cart.cartId}
                </p>
                <p>
                  <span className="font-medium">Cliente:</span>{" "}
                  {cart.customerId}
                </p>
                <p className="font-medium mt-2">Items:</p>
                <ul className="space-y-1">
                  {cart.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between rounded-lg bg-slate-800/80 px-3 py-2"
                    >
                      <span>
                        {item.productName}{" "}
                        <span className="text-slate-400">
                          (id={item.productId})
                        </span>
                      </span>
                      <span className="text-slate-200">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
            <h3 className="text-sm font-semibold text-slate-100">Orden</h3>
            {!order && (
              <p className="text-xs text-slate-400">
                Una vez se complete el checkout, verás aquí el detalle de la
                orden y los intentos de pago.
              </p>
            )}
            {order && (
              <div className="space-y-2 text-xs text-slate-200">
                <p>
                  <span className="font-medium">Order ID:</span> {order.orderId}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {order.status}
                </p>
                <p>
                  <span className="font-medium">Total:</span>{" "}
                  {order.total.toFixed(2)}
                </p>
                <p className="break-all text-[10px] text-slate-400">
                  <span className="font-medium text-slate-300">
                    Transaction UUID:
                  </span>{" "}
                  {order.transactionUuid}
                </p>
                <div className="mt-2">
                  <p className="font-medium mb-1">Intentos de pago:</p>
                  <ul className="space-y-1">
                    {order.attempts.map((a) => (
                      <li
                        key={a.attemptNumber}
                        className="flex items-center justify-between rounded-lg bg-slate-800/80 px-3 py-2"
                      >
                        <span>
                          Intento #{a.attemptNumber} · {a.message}
                        </span>
                        <span
                          className={
                            a.approved ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {a.approved ? "APPROVED" : "REJECTED"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logs del flujo */}
        <div className="mt-6 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-100">
            Logs del flujo (equivalente a las llamadas curl)
          </h3>
          {logs.length === 0 && (
            <p className="text-xs text-slate-400">
              Aún no hay logs. Ejecuta el flujo para ver los pasos.
            </p>
          )}
          {logs.length > 0 && (
            <ul className="max-h-48 space-y-1 overflow-auto text-[11px] text-slate-300">
              {logs.map((log, idx) => (
                <li key={idx} className="font-mono">
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
