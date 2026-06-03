import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminModal from "./AdminModal";
import * as AuthService from "../services/Auth";

vi.mock("../services/Auth", () => ({
  getToken: vi.fn(() => null),
  login: vi.fn(),
  logout: vi.fn(),
  saveToken: vi.fn(),
  verifyToken: vi.fn(() => Promise.resolve(false)),
}));

describe("AdminModal", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    dates: [],
    setDates: vi.fn(),
    posts: [],
    setPosts: vi.fn(),
    orders: [],
    subscribers: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(AuthService.getToken).mockReturnValue(null);
    vi.mocked(AuthService.verifyToken).mockResolvedValue(false);
  });

  it("affiche le formulaire de connexion", () => {
    render(<AdminModal {...defaultProps} />);

    expect(screen.getByPlaceholderText("Identifiant")).toBeTruthy();
    expect(screen.getByPlaceholderText("Mot de passe")).toBeTruthy();
  });

  it("met à jour les champs login", () => {
    render(<AdminModal {...defaultProps} />);

    const username = screen.getByPlaceholderText("Identifiant");
    const password = screen.getByPlaceholderText("Mot de passe");

    fireEvent.change(username, {
      target: { value: "admin" },
    });

    fireEvent.change(password, {
      target: { value: "password" },
    });

    expect(username.value).toBe("admin");
    expect(password.value).toBe("password");
  });

  it("affiche une erreur si connexion refusée", async () => {
    vi.mocked(AuthService.login).mockRejectedValueOnce(
      new Error("Connexion refusée"),
    );

    render(<AdminModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Identifiant"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
      target: { value: "badpass" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /connexion/i,
      }),
    );

    expect(await screen.findByText("Connexion refusée")).toBeTruthy();
  });

  it("se connecte avec succès", async () => {
    vi.mocked(AuthService.login).mockResolvedValueOnce({
      token: "fake-token",
    });

    render(<AdminModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Identifiant"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
      target: { value: "password" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /connexion/i,
      }),
    );

    expect(AuthService.login).toHaveBeenCalled();
  });

  it("ne s'affiche pas quand open=false", () => {
    render(<AdminModal {...defaultProps} open={false} />);

    expect(screen.queryByPlaceholderText("Identifiant")).toBeNull();
  });

  it("affiche le dashboard quand connecté", async () => {
    vi.mocked(AuthService.verifyToken).mockResolvedValueOnce(true);

    render(
      <AdminModal
        {...defaultProps}
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

    expect(await screen.findByText("dashboard")).toBeTruthy();
  });
});
