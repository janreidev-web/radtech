import positioningAnimation from '../../../assets/Animations/positioningAnimation.json';
import rayAnimation from '../../../assets/Animations/rayAnimation.json';
import procedureAnimation from '../../../assets/Animations/procedureAnimation.json';

const featureList = [
  {
    id: 'positioning',
    title: 'Interactive 3D Positioning',
    description:
      'Rotate, pan, and zoom a true-to-life 3D anatomical model. Understand the complex relationship between patient posture, anatomy, and radiographic outcomes like never before.',
    icon: 'position',
    animation: positioningAnimation,
    bulletPoints: [
      'Eliminate guesswork with hands-on practice.',
      'Visualize anatomical superimposition in real-time.',
    ],
  },
  {
    id: 'central-ray',
    title: 'Demystify the Central Ray',
    description:
      'Visualize the precise path of the x-ray beam. Adjust angulation and centering in real-time to see its impact on part distortion, magnification, and anatomical alignment.',
    icon: 'ray',
    animation: rayAnimation,
    bulletPoints: [
      'Perfect your technique before entering the lab.',
      "Understand the 'why' behind every CR angle.",
    ],
  },
  {
    id: 'procedure-guides',
    title: 'Step-by-Step Procedural Guides',
    description:
      "Follow clear, concise instructions integrated directly with the 3D model. From patient prep to evaluation criteria, our guides are aligned with Merrill's Atlas to ensure you're ready for the clinic.",
    icon: 'procedure',
    animation: procedureAnimation,
    bulletPoints: [
      'Study smarter with integrated learning.',
      'Build confidence for your practical exams.',
    ],
  },
];

export default featureList;

