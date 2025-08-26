import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";

export default function AddCourse() {
  const axiosSecure = useAxiosSecure();
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeKey, setActiveKey] = useState("");

  // Course form
  const [courseName, setCourseName] = useState("");
  const [courseKey, setCourseKey] = useState("");

  // Video form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoYt, setVideoYt] = useState("");
  const [videoOrder, setVideoOrder] = useState("");

  const loadCourses = async () => {
    try {
      const res = await axiosSecure.get("/courses");
      setCourses(res.data || []);
      if (res.data?.length && !activeKey) setActiveKey(res.data[0].key);
    } catch (e) {
      console.error(e);
    }
  };

  const loadVideos = async (key) => {
    if (!key) return setVideos([]);
    try {
      const res = await axiosSecure.get(`/videos?courseKey=${key}`);
      setVideos(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    loadVideos(activeKey);
  }, [activeKey]);

  const createCourse = async (e) => {
    e.preventDefault();
    if (!courseKey || !courseName) return toast.error("Key & Name required");
    try {
      await axiosSecure.post("/courses", { key: courseKey, name: courseName });
      toast.success("Course created");
      setCourseKey("");
      setCourseName("");
      loadCourses();
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to create");
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete course and all its videos?")) return;
    try {
      await axiosSecure.delete(`/courses/${id}`);
      toast.success("Course deleted");
      setActiveKey("");
      loadCourses();
      setVideos([]);
    } catch (e) {
      toast.error("Failed to delete course");
    }
  };

  const renameCourse = async (id) => {
    const name = prompt("New course name:");
    if (!name) return;
    try {
      await axiosSecure.patch(`/courses/${id}`, { name });
      toast.success("Course renamed");
      loadCourses();
    } catch (e) {
      toast.error("Failed to rename course");
    }
  };

  const addVideo = async (e) => {
    e.preventDefault();
    if (!activeKey) return toast.error("Select a course");
    if (!videoTitle || !videoYt) return toast.error("Title & YouTube ID required");

    try {
      await axiosSecure.post("/videos", {
        courseKey: activeKey,
        title: videoTitle,
        yt: videoYt,
        order: videoOrder ? Number(videoOrder) : undefined,
      });
      toast.success("Video added");
      setVideoTitle("");
      setVideoYt("");
      setVideoOrder("");
      loadVideos(activeKey);
    } catch (e) {
      toast.error("Failed to add video");
    }
  };

  const updateVideo = async (id) => {
    const title = prompt("New title (leave blank to skip):");
    const yt = prompt("New YouTube ID (leave blank to skip):");
    const order = prompt("New order (number, blank to skip):");
    const payload = {};
    if (title) payload.title = title;
    if (yt) payload.yt = yt;
    if (order) payload.order = Number(order);

    if (!Object.keys(payload).length) return;
    try {
      await axiosSecure.patch(`/videos/${id}`, payload);
      toast.success("Video updated");
      loadVideos(activeKey);
    } catch {
      toast.error("Failed to update video");
    }
  };

  const deleteVideo = async (id) => {
    if (!confirm("Delete this video?")) return;
    try {
      await axiosSecure.delete(`/videos/${id}`);
      toast.success("Video deleted");
      loadVideos(activeKey);
    } catch {
      toast.error("Failed to delete video");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Learn Admin</h1>

      {/* Create Course */}
      <form onSubmit={createCourse} className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
        <h2 className="font-semibold mb-3">Create Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="bg-gray-700 rounded px-3 py-2 outline-none"
            placeholder="Course Key (e.g., web-design)"
            value={courseKey}
            onChange={(e) => setCourseKey(e.target.value.trim())}
          />
          <input
            className="bg-gray-700 rounded px-3 py-2 outline-none"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 rounded px-4">Add Course</button>
        </div>
      </form>

      {/* Courses List */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
        <h2 className="font-semibold mb-3">Courses</h2>
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <div
              key={c._id}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border ${
                c.key === activeKey ? "bg-blue-600 border-transparent" : "bg-gray-700 border-gray-600"
              }`}
            >
              <button onClick={() => setActiveKey(c.key)}>{c.name}</button>
              <button onClick={() => renameCourse(c._id)} title="Rename" className="text-xs opacity-80 hover:opacity-100">✎</button>
              <button onClick={() => deleteCourse(c._id)} title="Delete" className="text-xs opacity-80 hover:opacity-100">🗑</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Video */}
      <form onSubmit={addVideo} className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
        <h2 className="font-semibold mb-3">
          Add Video {activeKey ? <span className="text-gray-400">to <b>{activeKey}</b></span> : null}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="bg-gray-700 rounded px-3 py-2 outline-none"
            placeholder="Title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />
          <input
            className="bg-gray-700 rounded px-3 py-2 outline-none"
            placeholder="YouTube ID (e.g., mU6anWqZJcc)"
            value={videoYt}
            onChange={(e) => setVideoYt(e.target.value.trim())}
          />
          <input
            className="bg-gray-700 rounded px-3 py-2 outline-none"
            placeholder="Order (optional)"
            value={videoOrder}
            onChange={(e) => setVideoOrder(e.target.value)}
          />
          <button className="bg-green-600 hover:bg-green-700 rounded px-4">Add Video</button>
        </div>
      </form>

      {/* Videos table */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <h2 className="font-semibold mb-3">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-gray-400">No videos yet.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-300">
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">YouTube ID</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v._id} className="border-t border-gray-700">
                    <td className="py-2 pr-3">{v.order ?? "—"}</td>
                    <td className="py-2 pr-3">{v.title}</td>
                    <td className="py-2 pr-3">{v.yt}</td>
                    <td className="py-2 pr-3 space-x-2">
                      <button
                        onClick={() => updateVideo(v._id)}
                        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVideo(v._id)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <a
                        className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800"
                        href={`https://www.youtube.com/watch?v=${v.yt}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
