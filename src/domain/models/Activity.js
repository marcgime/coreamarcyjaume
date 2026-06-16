/**
 * Representa una actividad en el programa del viaje.
 * Sigue los principios de Diseño de Dominio Limpio (sin acoplamiento externo).
 */
export class Activity {
  /**
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.title
   * @param {string} params.time
   * @param {string} params.category
   * @param {string} params.image
   * @param {string} [params.imageAlt]
   * @param {string} [params.description]
   */
  constructor({ id, title, time, category, image, imageAlt = '', description = '' }) {
    if (!id || !title || !time || !category || !image) {
      throw new Error("Missing required fields for Activity entity");
    }
    this.id = id;
    this.title = title;
    this.time = time;
    this.category = category;
    this.image = image;
    this.imageAlt = imageAlt;
    this.description = description;
  }
}
