import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CapRateCalculator = () => {
  const navigate = useNavigate();
  const [purchasePrice, setPurchasePrice] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [annualExpenses, setAnnualExpenses] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // Calculate Net Operating Income (NOI)
  const noi = parseFloat(annualIncome || "0") - parseFloat(annualExpenses || "0");

  // Calculate Cap Rate
  const capRate = purchasePrice && noi ? (noi / parseFloat(purchasePrice)) : 0;

  // Calculate Cash-on-Cash Return
  const cashInvested = parseFloat(downPayment || "0");
  const annualMortgagePayment = loanAmount && interestRate
    ? (parseFloat(loanAmount) * (parseFloat(interestRate) / 100)) / 12 * 12
    : 0;
  const annualCashFlow = noi - annualMortgagePayment;
  const cashOnCashReturn = cashInvested ? annualCashFlow / cashInvested : 0;

  // Calculate Gross Rent Multiplier (GRM)
  const grm = purchasePrice && annualIncome ? parseFloat(purchasePrice) / parseFloat(annualIncome) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/financials")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Cap Rate & ROI Calculator</h1>
            <p className="text-muted-foreground mt-1">
              Calculate key financial metrics for property investments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-primary" />
                Property Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="500000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="annualIncome">Annual Rental Income</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="60000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="annualExpenses">Annual Operating Expenses</Label>
                  <Input
                    id="annualExpenses"
                    type="number"
                    placeholder="20000"
                    value={annualExpenses}
                    onChange={(e) => setAnnualExpenses(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Property taxes, insurance, maintenance, utilities, HOA fees
                  </p>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="downPayment">Down Payment (Cash Invested)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    placeholder="100000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="400000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="5.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                Financial Metrics
              </h2>

              <div className="space-y-6">
                {/* Cap Rate */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Capitalization Rate (Cap Rate)</p>
                  <p className="text-4xl font-bold text-primary">{formatPercentage(capRate)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Higher cap rates indicate better potential return
                  </p>
                </div>

                {/* Cash-on-Cash Return */}
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Cash-on-Cash Return</p>
                  <p className="text-4xl font-bold text-green-600">{formatPercentage(cashOnCashReturn)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Annual return on your cash investment
                  </p>
                </div>

                {/* NOI */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Net Operating Income (NOI)</span>
                    <span className="font-semibold">{formatCurrency(noi)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Annual Cash Flow</span>
                    <span className={`font-semibold ${annualCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(annualCashFlow)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gross Rent Multiplier (GRM)</span>
                    <span className="font-semibold">{grm.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Income Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Rental Income</span>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(parseFloat(annualIncome || "0"))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Operating Expenses</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(parseFloat(annualExpenses || "0"))}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Net Operating Income</span>
                  <span className="text-primary">{formatCurrency(noi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Mortgage Payment</span>
                  <span className="font-medium text-red-600">-{formatCurrency(annualMortgagePayment)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Annual Cash Flow</span>
                  <span className={annualCashFlow >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(annualCashFlow)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Interpretation Guide */}
            <Card className="p-6 bg-muted/30">
              <h3 className="font-semibold mb-3">Interpretation Guide</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Cap Rate 4-6%:</strong> Premium properties in strong markets
                </p>
                <p>
                  <strong className="text-foreground">Cap Rate 7-10%:</strong> Standard investment properties
                </p>
                <p>
                  <strong className="text-foreground">Cap Rate 10%+:</strong> Higher risk, potential value-add
                </p>
                <p className="pt-2">
                  <strong className="text-foreground">Cash-on-Cash Return:</strong> Target 8-12% for good investments
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CapRateCalculator;
