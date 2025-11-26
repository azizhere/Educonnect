import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../models/Course.model.js";

export default {
  async addCourse(data) {
    return await createCourse(data);
  },

  async listCourses() {
    return await getAllCourses();
  },

  async editCourse(id, data) {
    return await updateCourse(id, data);
  },

  async removeCourse(id) {
    return await deleteCourse(id);
  },
};
