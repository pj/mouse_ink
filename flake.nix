{
  description = "Flake for mouse_ink dev environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
  };

  outputs = { self, nixpkgs }: 
    let 
        system = "aarch64-darwin";
        pkgs = nixpkgs.legacyPackages.${system};
        deps = rec {
            nodejs-18_x = pkgs.nodejs-18_x;
            default = nodejs-18_x;
        };
    in {
        packages.${system} = deps;
        devShells.${system}.default = pkgs.mkShell { packages = pkgs.lib.attrsets.attrValues deps; };
    };
}
