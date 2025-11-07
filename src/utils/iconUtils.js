import CasiAmenazadoIcon from '../assets/iconos-familias/casi_amenazado.png';
import PreocupacionMenorIcon from '../assets/iconos-familias/preocupación_menor.png';
import VulnerableIcon from '../assets/iconos-familias/Vulnerable.png';

export const getConservationIcon = (status) => {
  if (!status) {
    return PreocupacionMenorIcon; // Icono por defecto si el estado no está definido
  }
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('vulnerable')) {
    return VulnerableIcon;
  }
  if (lowerStatus.includes('casi amenazado')) {
    return CasiAmenazadoIcon;
  }
  if (lowerStatus.includes('preocupación menor')) {
    return PreocupacionMenorIcon;
  }
  return PreocupacionMenorIcon; // Icono por defecto para otros casos
};