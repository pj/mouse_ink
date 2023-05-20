{
  description = "Flake for lazy_test dev environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: 
    flake-utils.lib.eachDefaultSystem (system:
        let 
            pkgs = nixpkgs.legacyPackages.${system};
            deps = with pkgs; [
                nodejs-20_x
            ];
        in {
            packages = deps;
            devShell = pkgs.mkShell { buildInputs = deps; };
        }
    );
}