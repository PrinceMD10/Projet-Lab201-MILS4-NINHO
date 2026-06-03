import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminModal from "./AdminModal";

vi.mock("../services/Auth", () => ({
  getToken: vi.fn(() => "token"),
  login: vi.fn(),
  logout: vi.fn(),
  saveToken: vi.fn(),
  verifyToken: vi.fn(() => Promise.resolve(true)),
}));

describe("AdminModal dashboard", () => {
  it("affiche les KPI", async () => {
    render(
      <AdminModal
        open={true}
        onClose={() => {}}
        dates={[]}
        setDates={vi.fn()}
        posts={[]}
        setPosts={vi.fn()}
        orders={[
          {
            id: 1,
            total: 100,
            qty: 2,
          },
        ]}
        subscribers={[
          {
            email: "test@test.fr",
          },
        ]}
      />,
    );

    expect(await screen.findByText("Commandes")).toBeTruthy();

    expect(screen.getByText("100 €")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();

    expect(screen.getAllByText("1")).toHaveLength(2);
  });
});
