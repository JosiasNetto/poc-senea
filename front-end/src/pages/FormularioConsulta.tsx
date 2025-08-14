import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { Save, ArrowRight, User, Heart, Target, Clock, FileText, Activity, Beaker, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

const formSchema = z.object({
  // Seção 1: Dados Pessoais e Consulta
  dataConsulta: z.string().min(1, "Data da consulta é obrigatória"),
  cpf: z.string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .regex(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/, "Formato de CPF inválido"),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  ocupacao: z.string().optional(),
  sexo: z.enum(["masculino", "feminino"], {
    required_error: "Selecione o sexo",
  }),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  idade: z.string().min(1, "Idade é obrigatória"),
  telefone: z.string().optional(),
  email: z.string().optional(),
  vinculoUfpe: z.enum(["servidor", "estudante", "externo"], {
    required_error: "Selecione o vínculo com UFPE",
  }),
  objetivoHistoriaClinica: z.string().optional(),

  // Seção 2: Antropometria
  pressaoArterial: z.string().optional(),
  altura: z.string().min(1, "Altura é obrigatória"),
  imc: z.string().optional(),
  circunferenciaBraco: z.string().optional(),
  circunferenciaCintura: z.string().optional(),
  circunferenciaPanturrilha: z.string().optional(),
  circunferenciaPescoco: z.string().optional(),
  pesoHabitual: z.string().min(1, "Peso habitual é obrigatório"),
  pesoPerdido: z.string().optional(),
  tempoPerdaPeso: z.string().optional(),
  percentualPerdaPeso: z.string().optional(),
  perdaPesoIntencional: z.enum(["sim", "nao"], {
    required_error: "Informe se a perda de peso foi intencional",
  }),
  outrasMedidas: z.string().optional(),
  exameFisico: z.string().optional(),
  classificacao: z.string().optional(),

  // Seção 3: História Clínica
  historicoFamiliarDM: z.boolean().default(false),
  historicoFamiliarHAS: z.boolean().default(false),
  historicoFamiliarDVC: z.boolean().default(false),
  historicoFamiliarCancer: z.boolean().default(false),
  historicoFamiliarOutras: z.boolean().default(false),
  historicoFamiliarPsiquiatricas: z.string().optional(),
  temDiagnostico: z.enum(["sim", "nao"], {
    required_error: "Informe se tem diagnóstico de doença",
  }),
  quaisDiagnosticos: z.string().optional(),

  // Seção 4: Estilo de Vida
  bebidaAlcoolica: z.enum(["nunca", "1x_mes", "1-2x_mes", "3-4x_mes", "diariamente"], {
    required_error: "Selecione a frequência de bebida alcoólica",
  }),
  fuma: z.enum(["nunca", "diariamente", "raramente"], {
    required_error: "Selecione se fuma",
  }),
  atividadeFisica1: z.string().optional(),
  horarioAtividade1: z.string().optional(),
  frequenciaAtividade1: z.string().optional(),
  tempoAtividade1: z.string().optional(),
  atividadeFisica2: z.string().optional(),
  horarioAtividade2: z.string().optional(),
  frequenciaAtividade2: z.string().optional(),
  tempoAtividade2: z.string().optional(),
  refeicaoDesjejum: z.boolean().default(false),
  refeicaoLancheM: z.boolean().default(false),
  refeicaoAlmoco: z.boolean().default(false),
  refeicaoLancheT: z.boolean().default(false),
  refeicaoJantar: z.boolean().default(false),
  refeicaoCeia: z.boolean().default(false),
  horasSono: z.string().optional(),
  horarioMaisFome: z.enum(["manha", "tarde", "noite"], {
    required_error: "Selecione o horário de maior fome",
  }),
  jaFezDieta: z.enum(["sim", "nao"], {
    required_error: "Informe se já fez dieta antes",
  }),

  // Seção 5: Função Intestinal, Urinária, Alergias e Medicamentos
  habitoIntestinal: z.enum(["diario", "dias_alternados", "mais_2_dias"], {
    required_error: "Selecione o hábito intestinal",
  }),
  escalaBristol: z.string().optional(),
  aguaPorDia: z.string().optional(),
  corUrina: z.enum(["escura", "clara", "transparente"], {
    required_error: "Selecione a cor da urina",
  }),
  alergiaIntolerancia: z.string().optional(),
  queixasConstipacao: z.boolean().default(false),
  queixasDores: z.boolean().default(false),
  queixasAziaRefluxo: z.boolean().default(false),
  queixasFlatulencia: z.boolean().default(false),
  queixasOutras: z.string().optional(),
  suplementosMedicamentos: z.string().optional(),

  // Seção 6: Exames Bioquímicos
  dataExame: z.string().optional(),
  hemoglobina: z.string().optional(),
  hematocrito: z.string().optional(),
  vcm: z.string().optional(),
  hcm: z.string().optional(),
  chcm: z.string().optional(),
  rdw: z.string().optional(),
  hba1c: z.string().optional(),
  tgc: z.string().optional(),
  tgo: z.string().optional(),
  tgp: z.string().optional(),
  ureia: z.string().optional(),
  creatinina: z.string().optional(),
  acidoUrico: z.string().optional(),
  vitaminaD: z.string().optional(),
  colesterolTotal: z.string().optional(),
  hdl: z.string().optional(),
  ldl: z.string().optional(),
  vldl: z.string().optional(),
  glicemiaJejum: z.string().optional(),
  vitaminaB12: z.string().optional(),
  urinaTipoI: z.string().optional(),

  // Seção 7: Recordatório 24h
  cafeManha: z.string().optional(),
  cafeManhHora: z.string().optional(),
  cafeManhLocal: z.string().optional(),
  cafeManhObs: z.string().optional(),
  lancheManha: z.string().optional(),
  lancheManhaHora: z.string().optional(),
  lancheManhaLocal: z.string().optional(),
  lancheManhaObs: z.string().optional(),
  almocoRefeicao: z.string().optional(),
  almocoHora: z.string().optional(),
  almocoLocal: z.string().optional(),
  almocoObs: z.string().optional(),
  lancheTarde: z.string().optional(),
  lancheTardeHora: z.string().optional(),
  lancheTardeLocal: z.string().optional(),
  lancheTardeObs: z.string().optional(),
  jantarRefeicao: z.string().optional(),
  jantarHora: z.string().optional(),
  jantarLocal: z.string().optional(),
  jantarObs: z.string().optional(),
  ceiaRefeicao: z.string().optional(),
  ceiaHora: z.string().optional(),
  ceiaLocal: z.string().optional(),
  ceiaObs: z.string().optional(),
  observacoesGerais: z.string().optional(),
  alimentosNaoConsome: z.string().optional(),

  // Seção 8: Diagnóstico e Conduta
  diagnosticoNutricional: z.string().optional(),
  condutaNutricional: z.enum(["quantitativo", "qualitativo", "outros"], {
    required_error: "Selecione o tipo de conduta nutricional",
  }),
  outrosConduta: z.string().optional(),
  kcal: z.string().optional(),
  proteinaKg: z.string().optional(),
  orientacoes: z.string().optional(),
  planoCuidadoNutricional: z.string().optional(),
  solicitarExames: z.enum(["sim", "nao"], {
    required_error: "Informe se solicita exames",
  }),
  prescricaoSuplemento: z.string().optional(),
  nutricionista: z.string().optional(),
  estudantes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const FormularioConsulta = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataConsulta: new Date().toISOString().split('T')[0],
      cpf: "",
      nome: "",
      ocupacao: "",
      dataNascimento: "",
      idade: "",
      telefone: "",
      email: "",
      objetivoHistoriaClinica: "",
      pressaoArterial: "",
      altura: "",
      imc: "",
      circunferenciaBraco: "",
      circunferenciaCintura: "",
      circunferenciaPanturrilha: "",
      circunferenciaPescoco: "",
      pesoHabitual: "",
      pesoPerdido: "",
      tempoPerdaPeso: "",
      percentualPerdaPeso: "",
      outrasMedidas: "",
      exameFisico: "",
      classificacao: "",
      historicoFamiliarDM: false,
      historicoFamiliarHAS: false,
      historicoFamiliarDVC: false,
      historicoFamiliarCancer: false,
      historicoFamiliarOutras: false,
      historicoFamiliarPsiquiatricas: "",
      quaisDiagnosticos: "",
      atividadeFisica1: "",
      horarioAtividade1: "",
      frequenciaAtividade1: "",
      tempoAtividade1: "",
      atividadeFisica2: "",
      horarioAtividade2: "",
      frequenciaAtividade2: "",
      tempoAtividade2: "",
      refeicaoDesjejum: false,
      refeicaoLancheM: false,
      refeicaoAlmoco: false,
      refeicaoLancheT: false,
      refeicaoJantar: false,
      refeicaoCeia: false,
      horasSono: "",
      escalaBristol: "",
      aguaPorDia: "",
      alergiaIntolerancia: "",
      queixasConstipacao: false,
      queixasDores: false,
      queixasAziaRefluxo: false,
      queixasFlatulencia: false,
      queixasOutras: "",
      suplementosMedicamentos: "",
      dataExame: "",
      hemoglobina: "",
      hematocrito: "",
      vcm: "",
      hcm: "",
      chcm: "",
      rdw: "",
      hba1c: "",
      tgc: "",
      tgo: "",
      tgp: "",
      ureia: "",
      creatinina: "",
      acidoUrico: "",
      vitaminaD: "",
      colesterolTotal: "",
      hdl: "",
      ldl: "",
      vldl: "",
      glicemiaJejum: "",
      vitaminaB12: "",
      urinaTipoI: "",
      cafeManha: "",
      cafeManhHora: "",
      cafeManhLocal: "",
      cafeManhObs: "",
      lancheManha: "",
      lancheManhaHora: "",
      lancheManhaLocal: "",
      lancheManhaObs: "",
      almocoRefeicao: "",
      almocoHora: "",
      almocoLocal: "",
      almocoObs: "",
      lancheTarde: "",
      lancheTardeHora: "",
      lancheTardeLocal: "",
      lancheTardeObs: "",
      jantarRefeicao: "",
      jantarHora: "",
      jantarLocal: "",
      jantarObs: "",
      ceiaRefeicao: "",
      ceiaHora: "",
      ceiaLocal: "",
      ceiaObs: "",
      observacoesGerais: "",
      alimentosNaoConsome: "",
      diagnosticoNutricional: "",
      outrosConduta: "",
      kcal: "",
      proteinaKg: "",
      orientacoes: "",
      planoCuidadoNutricional: "",
      prescricaoSuplemento: "",
      nutricionista: "",
      estudantes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submission started", data);
    setIsLoading(true);
    try {
      // Determine objective based on form data
      let objetivo = "melhoria_saude";
      if (data.perdaPesoIntencional === "sim" || data.objetivoHistoriaClinica?.toLowerCase().includes("emagre")) {
        objetivo = "emagrecimento";
      } else if (data.objetivoHistoriaClinica?.toLowerCase().includes("ganho") || data.objetivoHistoriaClinica?.toLowerCase().includes("massa")) {
        objetivo = "ganho_massa";
      }
      
      // Extract preferences from form data
      const preferencias = [];
      if (data.alergiaIntolerancia?.toLowerCase().includes("vegetarian") || data.alergiaIntolerancia?.toLowerCase().includes("vegano")) {
        preferencias.push("vegetariano");
      }
      
      // Prepare form data for API
      const formPayload = {
        cpf: data.cpf.replace(/[^0-9]/g, ''), // Remove formatting
        nome: data.nome,
        forms: {
          idade: parseInt(data.idade) || 0,
          peso: parseFloat(data.pesoHabitual || "70"),
          altura: parseFloat(data.altura) || 0,
          objetivo: objetivo,
          restricoes: data.alergiaIntolerancia ? data.alergiaIntolerancia.split(',').map(r => r.trim()).filter(r => r) : [],
          preferencias: preferencias,
          // Additional clinical form data
          dataConsulta: data.dataConsulta,
          ocupacao: data.ocupacao,
          sexo: data.sexo,
          dataNascimento: data.dataNascimento,
          telefone: data.telefone,
          email: data.email,
          vinculoUfpe: data.vinculoUfpe,
          objetivoHistoriaClinica: data.objetivoHistoriaClinica,
          antropometria: {
            pressaoArterial: data.pressaoArterial,
            altura: data.altura,
            pesoHabitual: data.pesoHabitual,
            perdaPesoIntencional: data.perdaPesoIntencional
          },
          historiaClinica: {
            temDiagnostico: data.temDiagnostico,
            quaisDiagnosticos: data.quaisDiagnosticos
          },
          estiloVida: {
            bebidaAlcoolica: data.bebidaAlcoolica,
            fuma: data.fuma,
            jaFezDieta: data.jaFezDieta
          },
          funcaoIntestinal: {
            habitoIntestinal: data.habitoIntestinal,
            corUrina: data.corUrina,
            alergiaIntolerancia: data.alergiaIntolerancia
          }
        }
      };

      console.log("Calling API to create form with payload:", formPayload);
      // Call API service to create form
      const response = await apiService.createForm(formPayload);
      console.log("API response:", response);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Gerando sua receita personalizada...",
      });

      // Generate recipes using the API service
      const allergens = [];
      const dietaryRestrictions = [];
      
      if (data.alergiaIntolerancia) {
        const allergies = data.alergiaIntolerancia.toLowerCase().split(',').map(a => a.trim());
        allergies.forEach(allergy => {
          if (allergy.includes("lactose") || allergy.includes("leite")) {
            allergens.push("dairy");
            dietaryRestrictions.push("lactose-free");
          }
          if (allergy.includes("gluten")) {
            allergens.push("gluten");
            dietaryRestrictions.push("gluten-free");
          }
          if (allergy.includes("nozes") || allergy.includes("amendoim")) {
            allergens.push("nuts");
          }
          if (allergy.includes("vegetarian") || allergy.includes("vegetariano")) {
            dietaryRestrictions.push("vegetarian");
          }
          if (allergy.includes("vegano")) {
            dietaryRestrictions.push("vegan");
          }
        });
      }
      
      const recipeData = {
        cpf: formPayload.cpf,
        preferences: {
          dietaryRestrictions: dietaryRestrictions,
          preferredIngredients: data.cafeManha || data.almocoRefeicao || data.jantarRefeicao ? 
            [data.cafeManha, data.almocoRefeicao, data.jantarRefeicao].filter(meal => meal).join(',').split(',').map(ingredient => ingredient.trim()).filter(i => i) : [],
          allergens: allergens,
          maxCalories: 20000,
          cuisine: "brasileira",
          mealType: "completo",
          spiceLevel: "medium"
        }
      };

      console.log("Calling API to generate recipes with data:", recipeData);
      const recipeResponse = await apiService.generateRecipes(recipeData);
      console.log("Recipe response:", recipeResponse);
      
      // Navigate to the patients list page
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Redirecionando para a lista de pacientes...",
      });
      navigate('/pacientes', { 
        state: { 
          formData: data,
          user: response.user,
          receitas: recipeResponse.receitas || [],
          newPatient: true
        } 
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: User },
    { number: 2, title: "Antropometria", icon: Activity },
    { number: 3, title: "História Clínica", icon: FileText },
    { number: 4, title: "Estilo de Vida", icon: Heart },
    { number: 5, title: "Função Intestinal", icon: Target },
    { number: 6, title: "Exames", icon: Beaker },
    { number: 7, title: "Recordatório", icon: Utensils },
    { number: 8, title: "Diagnóstico", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-6xl mx-auto overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isActive ? 'bg-gradient-primary border-primary text-white shadow-glow' : 
                        isCompleted ? 'bg-primary border-primary text-white' : 
                        'border-border bg-background text-muted-foreground'}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="hidden lg:block">
                      <p className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-8 mx-2 transition-colors duration-300 ${
                      isCompleted ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form validation errors:", errors);
            toast({
              title: "Erro de validação",
              description: "Por favor, preencha todos os campos obrigatórios.",
              variant: "destructive",
            });
          })} className="max-w-6xl mx-auto">
            {/* Step 1: Dados Pessoais */}
            {currentStep === 1 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Ficha Adulto e Idoso - Primeira Consulta
                  </CardTitle>
                  <CardDescription>
                    Dados pessoais e informações básicas do paciente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="dataConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Consulta</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ocupacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ocupação</FormLabel>
                          <FormControl>
                            <Input placeholder="Ocupação profissional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sexo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexo</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="masculino" id="masculino" />
                                <label htmlFor="masculino" className="text-sm">M</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="feminino" id="feminino" />
                                <label htmlFor="feminino" className="text-sm">F</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="idade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Idade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone (WhatsApp)</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="exemplo@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vinculoUfpe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vínculo UFPE</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="servidor" id="servidor" />
                                <label htmlFor="servidor" className="text-sm">Servidor UFPE</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="estudante" id="estudante" />
                                <label htmlFor="estudante" className="text-sm">Estudante UFPE</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="externo" id="externo" />
                                <label htmlFor="externo" className="text-sm">Externo</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="objetivoHistoriaClinica"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo / História Clínica</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o objetivo da consulta e história clínica relevante..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Antropometria
                  </CardTitle>
                  <CardDescription>
                    Medidas corporais e avaliação física
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="pressaoArterial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pressão Arterial</FormLabel>
                          <FormControl>
                            <Input placeholder="120/80" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="altura"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (m)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="1.70" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IMC</FormLabel>
                          <FormControl>
                            <Input placeholder="Calculado automaticamente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pesoHabitual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso Habitual (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="70.0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="perdaPesoIntencional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perda de Peso Intencional</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sim" id="sim-perda" />
                                <label htmlFor="sim-perda" className="text-sm">Sim</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nao" id="nao-perda" />
                                <label htmlFor="nao-perda" className="text-sm">Não</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    História Clínica
                  </CardTitle>
                  <CardDescription>
                    Histórico de saúde e diagnósticos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="temDiagnostico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tem diagnóstico de doença?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sim" id="sim-diagnostico" />
                              <label htmlFor="sim-diagnostico" className="text-sm">Sim</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nao" id="nao-diagnostico" />
                              <label htmlFor="nao-diagnostico" className="text-sm">Não</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quaisDiagnosticos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais diagnósticos?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva os diagnósticos..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Estilo de Vida
                  </CardTitle>
                  <CardDescription>
                    Hábitos alimentares e atividade física
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bebidaAlcoolica"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequência de bebida alcoólica</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nunca">Nunca</SelectItem>
                                <SelectItem value="1x_mes">1x por mês</SelectItem>
                                <SelectItem value="1-2x_mes">1-2x por mês</SelectItem>
                                <SelectItem value="3-4x_mes">3-4x por mês</SelectItem>
                                <SelectItem value="diariamente">Diariamente</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fuma"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuma?</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nunca">Nunca</SelectItem>
                                <SelectItem value="raramente">Raramente</SelectItem>
                                <SelectItem value="diariamente">Diariamente</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jaFezDieta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Já fez dieta antes?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sim" id="sim-dieta" />
                                <label htmlFor="sim-dieta" className="text-sm">Sim</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nao" id="nao-dieta" />
                                <label htmlFor="nao-dieta" className="text-sm">Não</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="horarioMaisFome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de maior fome</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manha">Manhã</SelectItem>
                                <SelectItem value="tarde">Tarde</SelectItem>
                                <SelectItem value="noite">Noite</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Função Intestinal e Urinária
                  </CardTitle>
                  <CardDescription>
                    Hábitos intestinais e alergias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="habitoIntestinal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hábito Intestinal</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="diario">Diário</SelectItem>
                                <SelectItem value="dias_alternados">Dias alternados</SelectItem>
                                <SelectItem value="mais_2_dias">Mais de 2 dias</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="corUrina"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor da Urina</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="escura">Escura</SelectItem>
                                <SelectItem value="clara">Clara</SelectItem>
                                <SelectItem value="transparente">Transparente</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="alergiaIntolerancia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alergia/Intolerância Alimentar</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva alergias ou intolerâncias..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 6 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-primary" />
                    Exames Bioquímicos
                  </CardTitle>
                  <CardDescription>
                    Resultados de exames laboratoriais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="dataExame"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data do Exame</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="glicemiaJejum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Glicemia em Jejum</FormLabel>
                          <FormControl>
                            <Input placeholder="mg/dL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="colesterolTotal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Colesterol Total</FormLabel>
                          <FormControl>
                            <Input placeholder="mg/dL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 7 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary" />
                    Recordatório 24h
                  </CardTitle>
                  <CardDescription>
                    Registro de alimentação das últimas 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cafeManha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Café da Manhã</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o que consumiu..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="almocoRefeicao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Almoço</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o que consumiu..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jantarRefeicao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jantar</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o que consumiu..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="observacoesGerais"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações Gerais</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Observações sobre a alimentação..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 8 && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Diagnóstico e Conduta
                  </CardTitle>
                  <CardDescription>
                    Diagnóstico nutricional e plano de cuidado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="diagnosticoNutricional"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Diagnóstico Nutricional</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Diagnóstico nutricional..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="condutaNutricional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Conduta</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="quantitativo">Quantitativo</SelectItem>
                                <SelectItem value="qualitativo">Qualitativo</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="solicitarExames"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Solicitar Exames?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sim" id="sim-exames" />
                                <label htmlFor="sim-exames" className="text-sm">Sim</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nao" id="nao-exames" />
                                <label htmlFor="nao-exames" className="text-sm">Não</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="orientacoes"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Orientações</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Orientações nutricionais..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="min-w-[120px]"
              >
                Anterior
              </Button>
              
              {currentStep < 8 ? (
                <Button
                  type="button"
                  variant="medical"
                  onClick={nextStep}
                  className="min-w-[120px] gap-2"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="hero"
                  disabled={isLoading}
                  className="min-w-[120px] gap-2"
                  onClick={() => {
                    console.log("Button clicked, form errors:", form.formState.errors);
                    console.log("Form values:", form.getValues());
                  }}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? "Gerando..." : "Gerar Receita"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};