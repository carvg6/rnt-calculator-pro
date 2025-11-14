import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { Card } from '@/components/ui/card';
import logo from '@/assets/reental-logo.png';
import { formatNumber } from '@/lib/utils';

const StatusCalculator = () => {
  const [xRntAmount, setXRntAmount] = useState<string>('8000');
  const [statusType, setStatusType] = useState<string>('reentelpro');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [rntToBuy, setRntToBuy] = useState<string>('');
  const [calculatedDiscount, setCalculatedDiscount] = useState<number>(20);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);

  const { rntPrice, usdtEurRate, loading } = useCryptoPrice();

  const walletAddress = '0x4495Ba59116F7dF7AC6C438638AaDA85a6D6Cb0F1';

  // Calculate discount based on xRNT amount and status type
  useEffect(() => {
    const xRnt = parseFloat(xRntAmount) || 0;
    const discount = (statusType === 'superreentel' && xRnt >= 8000) ? 30 : 20;
    setCalculatedDiscount(discount);
  }, [xRntAmount, statusType]);

  const calculateFinalPrice = () => {
    const rntQuantity = parseFloat(rntToBuy) || 0;
    
    if (rntQuantity === 0) {
      return;
    }

    const basePrice = rntQuantity * rntPrice;
    const discountMultiplier = (100 - calculatedDiscount) / 100;
    const priceWithDiscount = basePrice * discountMultiplier;
    
    setFinalPrice(priceWithDiscount);
    setShowResults(true);
  };

  const calculateMissing = () => {
    const current = parseFloat(xRntAmount) || 0;
    const needed = statusType === 'reentelpro' ? 8000 : 28000;
    const missing = Math.max(0, needed - current);
    setRntToBuy(missing.toString());
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img src={logo} alt="Reental Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-accent mb-2">Calculadora de Status</h1>
          <p className="text-muted-foreground">By SergiDD</p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Client Data */}
          <Card className="p-6 border-2 border-accent rounded-xl bg-card">
            <h2 className="text-xl font-bold text-accent mb-6">
              1. Datos del cliente
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="xrnt" className="text-accent font-semibold mb-2 block">
                  $xRNT del cliente
                </Label>
                <Input
                  id="xrnt"
                  type="number"
                  value={xRntAmount}
                  onChange={(e) => setXRntAmount(e.target.value)}
                  className="bg-input border-none text-foreground"
                  placeholder="Ej: 8000, 10000, 28000..."
                />
              </div>

              <RadioGroup value={statusType} onValueChange={setStatusType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reentelpro" id="reentelpro" />
                  <Label htmlFor="reentelpro" className="text-accent font-semibold cursor-pointer">
                    ReentelPro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="superreentel" id="superreentel" />
                  <Label htmlFor="superreentel" className="text-accent font-semibold cursor-pointer">
                    SuperReentel
                  </Label>
                </div>
              </RadioGroup>

              <Button
                onClick={calculateMissing}
                className="w-full bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background font-semibold"
              >
                Calcular faltantes
              </Button>

              <div>
                <Label htmlFor="payment" className="text-accent font-semibold mb-2 block">
                  Método de pago
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-input border-none text-foreground">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer-eur">Transferencia en €</SelectItem>
                    <SelectItem value="transfer-usd">Transferencia en $</SelectItem>
                    <SelectItem value="crypto">Cripto (USDT / USDC en Polygon)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Preguntar siempre: "¿Prefieres pagar por transferencia en €/$ o con USDT/USDC en Polygon?"
                </p>
              </div>

              {paymentMethod === 'crypto' && (
                <div>
                  <Label htmlFor="wallet" className="text-accent font-semibold mb-2 block">
                    Wallet (para pagos en USDT/USDC Polygon)
                  </Label>
                  <Input
                    id="wallet"
                    type="text"
                    value={walletAddress}
                    readOnly
                    className="bg-input border-none text-foreground font-mono text-sm"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Right Column - Exchange & Discount */}
          <Card className="p-6 border-2 border-accent rounded-xl bg-card">
            <h2 className="text-xl font-bold text-accent mb-6">
              2. Cambio y descuento
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="rnt-amount" className="text-accent font-semibold mb-2 block">
                  Cantidad de $RNT a comprar
                </Label>
                <Input
                  id="rnt-amount"
                  type="number"
                  value={rntToBuy}
                  onChange={(e) => setRntToBuy(e.target.value)}
                  className="bg-input border-none text-foreground"
                  placeholder="Ej: 8000 o 28000"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Introduce los RNT que el cliente necesita adquirir.
                </p>
              </div>

              <div>
                <Label htmlFor="rnt-price" className="text-accent font-semibold mb-2 block">
                  Precio $RNT (USDT por 1 $RNT)
                </Label>
                <Input
                  id="rnt-price"
                  type="text"
                  value={formatNumber(rntPrice, 4)}
                  readOnly
                  className="bg-input border-none text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {loading ? 'Cargando precio en tiempo real...' : 'Precio en tiempo real del $RNT en el par RNT/USDT (Polygon).'}
                </p>
                <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ El precio proporcionado tendrá una validez de 24 horas, pasado este tiempo ya no será válido y tendrá que calcularlo de nuevo.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="usdt-eur" className="text-accent font-semibold mb-2 block">
                  Cambio USDT → EUR
                </Label>
                <Input
                  id="usdt-eur"
                  type="text"
                  value={formatNumber(usdtEurRate, 4)}
                  readOnly
                  className="bg-input border-none text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {loading ? 'Cargando tipo de cambio...' : `Ejemplo: si 1 USDT = ${formatNumber(usdtEurRate, 2)} €, escribe ${formatNumber(usdtEurRate, 2)}`}
                </p>
              </div>

              <div>
                <Label htmlFor="discount" className="text-accent font-semibold mb-2 block">
                  % Descuento aplicado
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={calculatedDiscount}
                  readOnly
                  className="bg-input border-none text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {(statusType === 'superreentel' && parseFloat(xRntAmount) >= 8000)
                    ? '30% de descuento (SuperReentel con +8000 xRNT)' 
                    : '20% de descuento'}
                </p>
              </div>

              <Button
                onClick={calculateFinalPrice}
                className="w-full bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background font-semibold py-6 text-lg"
              >
                Calcular precio final
              </Button>

              {showResults && (
                <div className="mt-6 p-6 bg-accent/10 border-2 border-accent rounded-lg space-y-4">
                  <h3 className="text-accent font-bold text-lg mb-4">Resultado del cálculo:</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-accent/30">
                      <span className="text-muted-foreground">Precio sin descuento:</span>
                      <span className="font-semibold text-foreground">
                        {formatNumber(parseFloat(rntToBuy) * rntPrice, 2)} USDT
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-accent/30">
                      <span className="text-muted-foreground">Descuento aplicado ({calculatedDiscount}%):</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        -{formatNumber((parseFloat(rntToBuy) * rntPrice * calculatedDiscount) / 100, 2)} USDT
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-accent font-bold text-lg">TOTAL A PAGAR:</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">
                          {formatNumber(finalPrice, 2)} USDT
                        </p>
                        <p className="text-lg text-muted-foreground">
                          ≈ {formatNumber(finalPrice * usdtEurRate, 2)} EUR
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                      💰 Te ahorras {formatNumber((parseFloat(rntToBuy) * rntPrice * calculatedDiscount) / 100, 2)} USDT con este descuento
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm border-t border-accent pt-4">
          Reental · Calculadora $RNT · Uso interno comercial
        </div>
      </div>
    </div>
  );
};

export default StatusCalculator;
