import { Component, computed, OnInit, signal } from '@angular/core';
import { AnalysisService } from '../../../services/analysis.service';

@Component({
  selector: 'app-key-learnings',
  imports: [],
  templateUrl: './key-learnings.html',
  styleUrl: './key-learnings.css',
})
export class KeyLearnings implements OnInit {

  prediction = signal<string | null>(null);

  constructor(private analysis: AnalysisService) {}

  ngOnInit() {
    this.analysis.result$.subscribe(res => {
      if (res) {
        this.prediction.set(res.class_name);
      }
    });
  }

  // 🔥 Learning content per lesion
  learningMap: Record<string, string> = {
    MEL: 'El melanoma es una forma agresiva de cáncer de piel que suele identificarse por asimetría, bordes irregulares y múltiples colores. Es fundamental detectar cambios rápidos en tamaño, forma o color, ya que el diagnóstico temprano mejora significativamente el pronóstico.',

    NV: 'Los nevos melanocíticos (lunares) suelen ser lesiones benignas con forma simétrica, color uniforme y bordes bien definidos. Generalmente permanecen estables en el tiempo, por lo que cualquier cambio debe ser evaluado.',

    BKL: 'La queratosis benigna es una lesión no cancerosa con apariencia verrugosa o “pegada” a la piel. Suele presentar colores marrones y una textura escamosa, sin signos de crecimiento invasivo.',

    BCC: 'El carcinoma basocelular es el tipo más común de cáncer de piel y suele aparecer como una lesión perlada con vasos visibles. Crece lentamente, pero puede causar daño local si no se trata.',

    AK: 'La queratosis actínica es una lesión precancerosa asociada a la exposición solar crónica. Se presenta como áreas ásperas, rojizas o escamosas y puede evolucionar a carcinoma si no se trata.',

    DF: 'El dermatofibroma es una lesión benigna firme que puede presentar un color marrón o rosado. Es característico que forme un “hoyuelo” al presionarse y generalmente no requiere tratamiento.',

    VASC: 'Las lesiones vasculares se originan en vasos sanguíneos y suelen tener color rojo, púrpura o azul. Muchas son benignas y pueden cambiar de color al aplicar presión.',

    SCC: 'El carcinoma de células escamosas es un cáncer de piel que suele presentarse como una lesión escamosa o ulcerada. Puede crecer progresivamente y sangrar, especialmente en zonas expuestas al sol.',

    '?': 'Cuando una lesión no presenta características claras, es importante considerar múltiples diagnósticos diferenciales. Se recomienda evaluación clínica y seguimiento para determinar su naturaleza.'
  };

  learning = computed(() => {
    return this.learningMap[this.prediction() ?? ''] || '';
  });
}