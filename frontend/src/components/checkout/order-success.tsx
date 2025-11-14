/**
 * Order success confirmation component displayed after successful checkout
 */

import React from "react";
import { motion } from "motion/react";
import { IconCheck, IconLoader, IconShoppingBag } from "@tabler/icons-react";
import { OrderDetails } from "@/types";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";

interface OrderSuccessProps {
  orderDetails: OrderDetails;
}

/** Displays order confirmation with order details and payment attempt history */
export const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderDetails }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-8 shadow-md dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50"
    >
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
        >
          {orderDetails.status === "COMPLETED" ? (
            <IconCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
          ) : (
            <IconLoader className="h-10 w-10 animate-spin text-orange-600 dark:text-orange-400" />
          )}
        </motion.div>
        <h2 className="mb-2 text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          {orderDetails.status === "COMPLETED"
            ? "¡Pedido realizado con éxito!"
            : "Pedido en proceso"}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          {orderDetails.status === "COMPLETED"
            ? "Tu pedido ha sido confirmado y procesado correctamente"
            : "Estamos procesando tu pedido, por favor espera..."}
        </p>
      </div>

      <div className="space-y-6 border-t border-neutral-200 pt-6 dark:border-neutral-700">
        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-zinc-800/80 dark:backdrop-blur-sm dark:border dark:border-zinc-800/30">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                Número de orden:
              </span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                {orderDetails.orderId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                ID de transacción:
              </span>
              <span className="font-mono text-xs text-neutral-800 dark:text-neutral-100">
                {orderDetails.transactionUuid}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                Total:
              </span>
              <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                ${orderDetails.total}
              </span>
            </div>
          </div>
        </div>

        {orderDetails.attempts && orderDetails.attempts.length > 0 && (
          <div className="rounded-lg bg-neutral-50 p-4 dark:bg-zinc-800/80 dark:backdrop-blur-sm dark:border dark:border-zinc-800/30">
            <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              Intentos de pago:
            </h3>
            <div className="space-y-2">
              {orderDetails.attempts.map((attempt, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-white p-3 dark:bg-zinc-900/90 dark:backdrop-blur-sm dark:border dark:border-zinc-800/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Intento {attempt.attemptNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      {attempt.approved ? (
                        <IconCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <span className="h-5 w-5 text-red-600 dark:text-red-400">✕</span>
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          attempt.approved
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {attempt.approved ? "Aprobado" : "Rechazado"}
                      </span>
                    </div>
                  </div>
                  {attempt.message && (
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {attempt.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Recibirás un correo electrónico de confirmación en breve.
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Redirigiendo a la tienda en 5 segundos...
          </p>
          <button
            onClick={() => router.push(ROUTES.STORE)}
            className="mt-4 rounded-md bg-white px-6 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition duration-200 hover:-translate-y-0.5 dark:bg-zinc-800/90 dark:text-white dark:backdrop-blur-sm dark:border dark:border-zinc-700/50"
          >
            <IconShoppingBag className="mr-2 inline h-4 w-4" />
            Volver a la tienda
          </button>
        </div>
      </div>
    </motion.div>
  );
};

