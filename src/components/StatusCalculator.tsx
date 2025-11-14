import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { Card } from '@/components/ui/card';
import logo from '@/assets/reental-logo.png';

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

  // Calculate discount based on xRNT amount
  useEffect(() => {
    const xRnt = parseFloat(xRntAmount) || 0;
    const discount = xRnt >= 8000 ? 30 : 20;
    setCalculatedDiscount(discount);
  }, [xRntAmount]);

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
                  type="number"
                  value={rntPrice.toFixed(4)}
                  readOnly
                  className="bg-input border-none text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {loading ? 'Cargando precio en tiempo real...' : 'Precio en tiempo real del $RNT en el par RNT/USDT (Polygon).'}
                </p>
              </div>

              <div>
                <Label htmlFor="usdt-eur" className="text-accent font-semibold mb-2 block">
                  Cambio USDT → EUR
                </Label>
                <Input
                  id="usdt-eur"
                  type="number"
                  value={usdtEurRate.toFixed(4)}
                  readOnly
                  className="bg-input border-none text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {loading ? 'Cargando tipo de cambio...' : `Ejemplo: si 1 USDT = ${usdtEurRate.toFixed(2)} €, escribe ${usdtEurRate.toFixed(2)}`}
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
                  {parseFloat(xRntAmount) >= 8000 
                    ? '30% de descuento (tiene +8000 xRNT)' 
                    : '20% de descuento (sin xRNT o menos de 8000)'}
                </p>
              </div>

              <Button
                onClick={calculateFinalPrice}
                className="w-full bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background font-semibold py-6 text-lg"
              >
                Calcular precio final
              </Button>

              {showResults && (
                <div className="mt-6 p-4 bg-accent/10 border-2 border-accent rounded-lg">
                  <h3 className="text-accent font-bold mb-2">Resultado:</h3>
                  <p className="text-2xl font-bold text-foreground">
                    {finalPrice.toFixed(2)} USDT
                  </p>
                  <p className="text-lg text-muted-foreground">
                    ≈ {(finalPrice * usdtEurRate).toFixed(2)} EUR
                  </p>
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
