import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-resolucion-problemas',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './resolucion-problemas.component.html',
  styleUrls: ['./resolucion-problemas.component.css']
})
export class ResolucionProblemasComponent {
  step: number = 1; 
  currentTextIndex: number = 0;
  currentQuestionIndex: number = 0;
  

  texts: string[] = [
    "En esta sección, usted trabajará como miembro del equipo de producción de tazas de plástico. El proceso de producción se muestra a la izquierda. Observe que hay seis fases en el proceso. A continuación, verá una descripción de cada fase. Lea cuidadosamente la descripción, pero no se preocupe por memorizar la información. Cuando empiece la sección, tendrá oportunidad de verla de nuevo.",
    "Al principio del problema hay 1000 esferas de plástico en el alimentador grande. Estas esferas serán utilizadas en la Fase 1.</strong>",
    "<strong>FASE 1:</strong> <br>Las esferas de plástico son inyectadas en la máquina de modelado, la cual las calienta y las prensa en el molde para darles la forma de taza. Esta etapa toma <strong>10 segundos.</strong>",
    "<strong>FASE 2:</strong> <br>La taza entra a la maquina de pulimiento, que le da un acabado suave. Esta etapa toma <strong>5 segundos.</strong>",
    "<strong>FASE 3:</strong> <br>La taza entra al taller de pintura y se le aplica una capa de esmalte. Esta etapa toma <strong>10 segundos.</strong>",
    "<strong>FASE 4:</strong> <br>La taza entra al horno de secado. Esta etapa toma <strong>10 segundos.</strong>",
    "<strong>FASE 5:</strong> <br>La taza ingresa a la máquina de grabado y se le graba el logotipo. Esta etapa toma <strong>5 segundos.</strong>",
    "<strong>FASE 6:</strong> <br>La taza ingresa a la máquina de empacado y es colocada en una caja. Esta etapa toma <strong>10 segundos.</strong>",
    "<h3>Factores que Afectan la Calidad</h3> <br><strong> Etapa factor(es)</strong> <br> 1. Calor, presión. <br> 2. Mezcla química <br> 3. Humedad, calidad de pintura. <br> 4. Calor, humedad. <br> 5. Presión, textura de la superficie. <br> <br> <br> <br> <br> <br> <h4>Hay varios factores que afectan la calidad de las tazas.</h4>",
    "<h3>Factores que Afectan la Calidad</h3> <strong> Etapa factor(es)</strong> <br> <h5> 1. Calor, presión. <br> 2. Mezcla química <br> 3. Humedad, calidad de pintura. <br> 4. Calor, humedad. <br> 5. Presión, textura de la superficie.</h5>",
    "En las preguntas 1-5 usted necesita hacer cálculos, utilice la calculadora. Use la calculadora presionando el teclado numérico o bien, haga click sobre los números de la calculadora. Las teclas de funciones especiales de presentan a continuación (si no está familiarizado con esta información, puede anotarla): <br> <br> <strong> + suma <br> - Resta <br>  * Multiplicación <br>  / División <br> . Punto decimal <br>  C Borrar <br> Respuesta Transfiere el cálculo al cuadro de respuesta </strong> <br> <br> <h5>  Haga click en el botón para navegar por esta sección de ayuda. <br> Haga click en OK para continuar con la evaluación. </h5>"
  ];

  questions: string[] =[
    "<strong>¿Cuántos segundos se necesitan para que una taza pase por todo el proceso (Fase 1 hasta Fase 6) </strong> <br> <h5> Nota: Se necesitan 5 segundos entre cada fase. <br> Calcule su respuesta utilizando la calculadora. <br> Una vez que haya obtenido la respuesta haga click en Respuesta para transferirla al cuadro de respuesta. Cuando haya terminado haga click en OK.</h5>",
    "<strong>Usted dijo que toma 5 segundos para que una taza pase por todo el proceso. Utilice el número del cuadro para hacer cálculos futuros con respecto a la velocidad de producción de tazas.</strong> <br> <h5> Haga click en OK para pasar a la siguiente pregunta.</h5>",
    "<strong>¿Cuántos minutos se necesitan para producir 10 tazas?</strong> <br> <h5> Nota: Se neecsitan 5 segundos entre cada fase. <br> Nota: Tan pronto como una taza pasa la Fase 1 otra puede empezar la Fase 1 inmediatamente.</h5>",
    "<strong>¿Cuántos minutos se necesitan para producir 100 tazas?</strong> br> <h5> Nota: Se neecsitan 5 segundos entre cada fase. <br> Nota: Suponga que la línea está vacía (no hay tazas en la línea).<h5>",
    "<strong>Suponga que ha producido 200 tazas. Para cada taza se utilizan 3 esferas de plástico. ¿Cuántas esferas quedan en el alimentador de esferas de plástico?</strong> <br> <h5> Nota: La producción empezó con 1000 esferas en el alimentador.</h5>",
    "<strong>Se necesitan 3 esferas de plástico para hacer 1 taza. ¿Cuántos minutos se necesitan para usar 600 esferas?</strong> <br> <h5> Nota: Se necesitan 5 segundos entre cada fase. <br> Nota: Suponga que la linea esta vacía (No hay tazas en la línea).</h5>",
    "<strong>Usted notó, en el pase 5, que las tazas todavía tienen esperezas (no están lisas). <br> ¿Dónde sería el mejor lugar para empezar a buscar los problemas?</strong>",
    "<strong>Observe que la pintura, no el logotipo, se está<z manchando <br> ¿Qué factor puede ser la causa?</strong>",
    "<strong>Observe, en el paso 6 que el grosor de las tazas está fuera de las especificaciones (demasiado delgadas). <br> ¿Cuál es el mejor lugar para empezar a buscar el problema?</strong>",
    "<strong>Si hay problemas con la humedad, ¿Dónde se manifestarían los problemas?</strong>",
    "<strong>Si hay un problema con la presión de la máquina de inyección de moldeo, ¿Dónde se manifestarán los problemas?</strong>"
  ]



  get currentText(): string {
    return this.texts[this.currentTextIndex];
  }

  get currentQuestion(): string {
    return this.questions[this.currentQuestionIndex];
  }

  nextText() {
    if (this.currentTextIndex < this.texts.length - 3) { 
      this.currentTextIndex++;
    } else {
      this.step = 2; 
    }
  }

  prevText() {
    if (this.currentTextIndex > 0) {
      this.currentTextIndex--;
    } else if (this.step === 2) {
      this.step = 1;
      this.currentTextIndex = this.texts.length - 3; 
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) { 
      this.currentQuestionIndex++;
    } else {
      this.step = 4; 
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else if (this.step === 3) {
      this.step = 2; 
       this.currentQuestionIndex = 0; 
       } else if (this.step === 2) {
      this.step = 1;
       this.currentQuestionIndex = 0; 
       }
  }
  
  nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }
  
  prevStep() {
    if (this.step === 3 && this.currentQuestionIndex === 0) {
      this.step = 2;  
    } else if (this.step > 1) {
      this.step--; 
    }
  }
  

  getHiddenText(): string {
    return this.texts[9]; 
  }

  getHiddenText1(): string {
    return this.texts[10]; 
  }
}
