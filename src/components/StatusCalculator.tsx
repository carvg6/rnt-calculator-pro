import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCryptoPrice } from "@/hooks/useCryptoPrice";
import { Card } from "@/components/ui/card";
import logo from "@/assets/reental-logo.png";
import { formatNumber } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const StatusCalculator = () => {
  const [xRntAmount, setXRntAmount] = useState<string>("");
  const [statusType, setStatusType] = useState<string>("superreentel");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [rntToBuy, setRntToBuy] = useState<string>("");
  const [calculatedDiscount, setCalculatedDiscount] = useState<number>(30);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{
    xRnt?: string;
    rntToBuy?: string;
    paymentMethod?: string;
  }>({});

  const { rntPrice, usdtEurRate, loading } = useCryptoPrice();
  const walletAddress = "0x4495Ba59116F7dF7AC6C438638AaDA85a6D6Cb0F1";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success("Wallet copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar la wallet");
    }
  };

  // Calculate discount based on xRNT amount and status type
  useEffect(() => {
    const xRnt = parseFloat(xRntAmount) || 0;
    // 30% for SuperReentel with >= 8000 xRNT, 20% for all others
    const discount = statusType === "superreentel" && xRnt >= 8000 ? 30 : 20;
    setCalculatedDiscount(discount);
  }, [xRntAmount, statusType]);

  const validateInputs = () => {
    const newErrors: {
      xRnt?: string;
      rntToBuy?: string;
      paymentMethod?: string;
    } = {};

    if (xRntAmount && (isNaN(parseFloat(xRntAmount)) || parseFloat(xRntAmount) < 0)) {
      newErrors.xRnt = "Por favor, introduce solo números válidos";
    }

    if (!rntToBuy || isNaN(parseFloat(rntToBuy)) || parseFloat(rntToBuy) <= 0) {
      newErrors.rntToBuy = "Por favor, introduce una cantidad válida de RNT";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Por favor, selecciona un método de pago";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateFinalPrice = () => {
    if (!validateInputs()) {
      return;
    }

    const rntQuantity = parseFloat(rntToBuy) || 0;
    const basePrice = rntQuantity * rntPrice;
    const discountMultiplier = (100 - calculatedDiscount) / 100;
    const priceWithDiscount = basePrice * discountMultiplier;

    setFinalPrice(priceWithDiscount);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setXRntAmount("");
    setStatusType("superreentel");
    setPaymentMethod("");
    setRntToBuy("");
    setCalculatedDiscount(30);
    setFinalPrice(0);
    setShowResults(false);
    setErrors({});
  };

  const calculateMissing = () => {
    const current = parseFloat(xRntAmount) || 0;
    const needed = statusType === "reentelpro" ? 14000 : 28000;
    const missing = Math.max(0, needed - current);
    setRntToBuy(missing.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img src={logo} alt="Reental Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Calculadora de Status RNT
          </h1>
          <p className="text-gray-600">
            Calcula tu precio final con descuentos exclusivos
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          <div className="space-y-6">
            {/* User Data Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Datos del Usuario
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="xrnt" className="text-base">
                  Cantidad de xRNT actual
                </Label>
                <Input
                  id="xrnt"
                  type="number"
                  value={xRntAmount}
                  onChange={(e) => setXRntAmount(e.target.value)}
                  placeholder="Ej: 10000"
                  className={errors.xRnt ? "border-red-500" : ""}
                />
                {errors.xRnt && (
                  <p className="text-sm text-red-500">{errors.xRnt}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base">Selecciona tu Status</Label>
                <RadioGroup value={statusType} onValueChange={setStatusType}>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="reentelpro" id="reentelpro" />
                    <Label htmlFor="reentelpro" className="cursor-pointer flex-1">
                      <div className="font-semibold">ReentelPro</div>
                      <div className="text-sm text-gray-600">14,000 xRNT - 20% descuento</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="superreentel" id="superreentel" />
                    <Label htmlFor="superreentel" className="cursor-pointer flex-1">
                      <div className="font-semibold">SuperReentel</div>
                      <div className="text-sm text-gray-600">28,000 xRNT - 30% descuento</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Te faltan {" "}
                  <span className="font-bold">
                    {formatNumber(Math.max(0, (statusType === "reentelpro" ? 14000 : 28000) - (parseFloat(xRntAmount) || 0)))}
                  </span>
                  {" "} xRNT para alcanzar {statusType === "reentelpro" ? "ReentelPro" : "SuperReentel"}
                </p>
                <Button
                  onClick={calculateMissing}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Calcular RNT necesarios
                </Button>
              </div>
            </div>

            {/* Exchange Info Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Información de Cambio
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Precio actual RNT</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${loading ? "..." : rntPrice.toFixed(3)}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Cambio USDT a EUR</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : usdtEurRate.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Purchase Details Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Detalles de Compra
              </h2>

              <div className="space-y-2">
                <Label htmlFor="rntAmount" className="text-base">
                  Cantidad de RNT a comprar
                </Label>
                <Input
                  id="rntAmount"
                  type="number"
                  value={rntToBuy}
                  onChange={(e) => setRntToBuy(e.target.value)}
                  placeholder="Ej: 5000"
                  className={errors.rntToBuy ? "border-red-500" : ""}
                />
                {errors.rntToBuy && (
                  <p className="text-sm text-red-500">{errors.rntToBuy}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-base">
                  Método de Pago
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger 
                    id="paymentMethod"
                    className={errors.paymentMethod ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usdt">USDT</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="btc">BTC</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMethod && (
                  <p className="text-sm text-red-500">{errors.paymentMethod}</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  Descuento aplicado: <span className="font-bold">{calculatedDiscount}%</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={calculateFinalPrice}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                Calcular
              </Button>
              <Button
                onClick={resetCalculator}
                variant="outline"
                size="lg"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        {showResults && (
          <Card className="mt-8 p-8 shadow-xl bg-gradient-to-br from-white to-blue-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Resultado del Cálculo
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">xRNT Actuales</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatNumber(parseFloat(xRntAmount) || 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">RNT a Comprar</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatNumber(parseFloat(rntToBuy) || 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Status Elegido</p>
                  <p className="text-xl font-bold text-gray-900">
                    {statusType === "reentelpro" ? "ReentelPro" : "SuperReentel"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Método de Pago</p>
                  <p className="text-xl font-bold text-gray-900 uppercase">
                    {paymentMethod}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Descuento Aplicado</p>
                  <p className="text-xl font-bold text-green-600">
                    {calculatedDiscount}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Precio RNT</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${rntPrice.toFixed(3)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Cambio USDT a EUR</p>
                  <p className="text-xl font-bold text-gray-900">
                    {usdtEurRate.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg shadow-lg">
                <p className="text-lg text-gray-700 mb-2">Precio Base</p>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  ${formatNumber((parseFloat(rntToBuy) || 0) * rntPrice)}
                </p>

                <p className="text-lg text-gray-700 mb-2">Con descuento del {calculatedDiscount}%</p>
                <p className="text-4xl font-bold text-green-600">
                  ${formatNumber(finalPrice)}
                </p>
                {paymentMethod === "usdt" && (
                  <p className="text-xl text-gray-700 mt-2">
                    ≈ €{formatNumber(finalPrice * usdtEurRate)}
                  </p>
                )}
              </div>

              {paymentMethod && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Dirección de pago ({paymentMethod.toUpperCase()})
                  </p>
                  <div className="flex items-center gap-2 bg-white p-3 rounded border">
                    <code className="flex-1 text-sm break-all">{walletAddress}</code>
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StatusCalculator;
